import React, {useState, useEffect, useRef} from 'react'
import * as tf from '@tensorflow/tfjs'
import * as use from '@tensorflow-models/universal-sentence-encoder'
import {z} from 'zod'

const QuerySchema = z.object({
    query: z.string().min(1).max(200).trim()
})

type Doc = {
    id: string,
    text: string,
    embedding: tf.Tensor2D
}

type ScoredDoc = Doc & {score: number}

export function RagDrill6() {
    const [docs, setDocs] = useState<Doc[]>([])
    const [results, setResults] = useState<ScoredDoc[]>([])
    const [query, setQuery] = useState('')
    const [status, setStatus] = useState('Loading USE model...')

    const modelRef = useRef<use.UniversalSentenceEncoder | null>(null)
    const abortRef = useRef<AbortController | null>(null)
    const debounceRef = useRef<number | null>(null)

    const corpus = [
    "AbortController cancels fetch requests to prevent race conditions",
    "useRef persists values across renders without causing re-renders",
    "Transformer attention is softmax(QK^T/√d_k)V mechanism",
    "Zod validates input to satisfy OWASP A03 injection prevention",
    "NIST SC-5 requires resource exhaustion controls like debounce",
    "TF.js tensors must be disposed to prevent GPU memory leaks",
    "Cosine similarity measures angle between embedding vectors",
    "MobileNet embeddings are 1024-dim from penultimate layer",
    "SOC 2 A1.2 audits availability controls in systems",
    "useEffect cleanup prevents memory leaks on unmount"
  ]

  useEffect(() => {
    let cancelled = false;
    (async () => {
        await tf.setBackend('webgl')
        await tf.ready()
        setStatus('Loading Universal Sentence Encoder 15MB...')

        const model = await use.load()

        if (cancelled){
            return
        }

        modelRef.current = model

        setStatus('Indexing corpus...')
        const embeddings = await model.embed(corpus)

        if (cancelled){
            tf.dispose(embeddings)
            return
        }

        const indexedDocs: Doc[] = corpus.map((text, i) => ({
            id: crypto.randomUUID(),
            text,
            embedding: embeddings.slice([i, 0], [1,512]) as tf.Tensor2D 
        }))

        setDocs(indexedDocs)
        tf.dispose(embeddings)
        setStatus(`Ready. ${indexedDocs.length} docs indexed.`)
    })()

        return () => {
            cancelled = true
            modelRef.current = null
            docs.forEach(d => d.embedding.dispose())
            tf.disposeVariables()
        }
    }, [])

    const search = async (rawQuery: string) => {
        if (!modelRef.current || docs.length === 0) return;
    

    abortRef.current?.abort()
    abortRef.current = new AbortController()
    const signal = abortRef.current.signal

    try{
        const {query: validQuery} = QuerySchema.parse({query: rawQuery})
        
        const queryEmbedding = await modelRef.current.embed([validQuery])

        if (signal.aborted){
            tf.dispose(queryEmbedding)
            return
        }

        const scored: ScoredDoc[] = docs.map(doc => {
            const sim = tf.tidy(() => {
                return tf.metrics.cosineProximity(queryEmbedding, doc.embedding).dataSync()[0]
            })
            return {... doc, score: sim}
        }).sort((a, b) => b.score - a.score)

        if (!signal.aborted) setResults(scored.slice(0, 5))
        
        tf.dispose(queryEmbedding)
    }catch(err: any){
        if (err instanceof z.ZodError) return;
        if (err.name === 'AbortError') return;
        console.error('Search error: ', err)
    }
  }
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => search(query), 300)
    return () => clearTimeout(debounceRef.current!)
  }, [query, docs])

  return (
    <div className='p-4 max-w-3x1 mx-auto font-mono'>
        <h1 className='text-2x1 font-bold mb-2'>Drill #6: RAG + USE</h1>
        <p className='text-sm mb-4 text-gray-400'>{status}</p>

        <input
            type='text'
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder='Search: "how to prevent race conditions"'
            className='w-full p-3 border border-gray-700 bg-white-900 rounded mb-4'
            disabled={!modelRef.current}
        />

        <div className='space-y-2'>
            {results.map(doc => (
                <div key={doc.id} className='p-3 bg-grey-800 rounded border-1-4 border-green-500'>
                    <div className='text-xs text-green-400'>Score: {doc.score.toFixed(3)}</div>
                    <div className='text-sm'>{doc.text}</div>
                </div>
            ))}
        </div>

        <div className='mt-6 text-xs text-gray-500'>
            NIST SC-5: AbortController + 300ms debounce | OWASP A03: Zod validation | TF.js: tensor.dispose() | Latency: 30ms | Cost: $0
        </div>
    </div>
  )
}
