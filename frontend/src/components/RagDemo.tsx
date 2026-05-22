import {useState, useEffect, useRef} from 'react'

type Doc = {id: number, text: string, score?: number}

const embed = (text: string): number[] => {
    const v = new Array(16).fill(0)
    for (let i = 0; i < text.length; i++) {
        v[i % 16] += text.charCodeAt(i)
    }
    const norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1
    return v.map(x => x / norm)
}

const cosSim = (a: number[], b: number[]): number => a.reduce((s, x, i) => s + x * b[i], 0)

const DOCS: Doc[] = [
    {id: 1, text: 'TensorFlow.js runs ML in browser using WebGL GPU'},
    {id: 2, text: 'React hooks manage component state and effects lifecycle'},
    {id: 3, text: 'Xfinity xFi blocks .bin files from Google Storage CDN'},
    {id: 4, text: 'AbortController cancels fetch after timeout to prevent hangs'}
]

export default function RagDemo() {
    const [query, setQuery] = useState('GPU in browser')
    const [status, setStatus] = useState('Idle')
    const [error, setError] = useState(null)
    const [results, setResults] = useState<Doc[]>([])
    const [loading, setLoading] = useState(false)
    const timeoutRef = useRef<number | null>(null)
    const abortRef = useRef<AbortController | null>(null)

    useEffect(() => {
        if(!query.trim()) {
            setResults([])
            setStatus('Idle')
            return
        }

        setLoading(true)
        setError(null)
        setStatus('Debouncing...')

        abortRef.current?.abort()
        abortRef.current = new AbortController()

        timeoutRef.current = setTimeout( async () => {
            try{
                setStatus('Embedding query...')
                await new Promise(r => setTimeout(r,100))

                if(abortRef.current?.signal.aborted){
                    throw new Error('Cancelled: user typed again')
                }
            }catch(err: any){
                console.log(err.message)
            }
        })
    })

    const runRag = async () => {
        const controller = new AbortController()
        const timeout = setTimeout(() => 
            controller.abort(), 5000
        )

        try{
            setStatus('Embedding query...')
            await new Promise(r => setTimeout(r, 100))

            if(controller.signal.aborted) throw new Error('Timeout')

            const qVec = embed(query)
            const scored = DOCS.map(d => ({...d, score: cosSim(qVec, embed(d.text))}))
                               .sort((a, b) => b.score! - a.score!)
                               .slice(0, 2)
            clearTimeout(timeout)
            setResults(scored)
            setStatus('Done. Top 2 docs retrieved')
        }catch(err: any){
            clearTimeout(timeout)
            setError(err.message)
        }
    }

    return (
        <div className='p-6 border-t-2 border-gray-100 font-sans'>
            <h2 className='text-x1 font-bold mb-4'>Drill #3: RAG Offline</h2>

            <div className='flex gap-2 mb-4'>
                <input value={query}
                       onChange={e => setQuery(e.target.value)}
                       className='flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                       placeholder='Type query...'
                />
                <button onClick={runRag}
                        disabled={loading}
                        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors'
                >
                    {loading? 'Retrieving...' : 'Retrieve'}
                </button>
            </div>

            <p className='mb-4 text-sm'>
                <span className='font-semibold'>Status: </span> {status}
            </p>

            <div className='space-y-3'>
                {results.map(r  => (
                    <div key={r.id} className='border border-gray-200 rounded-lg p-3 bg-gray-50'>
                        <div className='flex justify-between items-center mb-1'>
                            <span className='text-xs font-mono text-gray-500'>Doc #{r.id}</span>
                            <span className='text-sm font-bold text-blue-600'>Score: {r.score?.toFixed(3)}</span>
                        </div>
                        <p className='text-gray-800'>{r.text}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}