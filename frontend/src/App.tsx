import {useEffect, useState} from 'react'
import RagDemo from './components/RagDemo'
import * as tf from '@tensorflow/tfjs'
import {RagDrill6} from './components/model'

export default function App(){
  const [status, setStatus] = useState<'loading' | 'idle' | 'ready' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => {
      controller.abort()
      setError('Error: Model load timed out after 10s')
    }, 10000)

    async function init() {
      try{
        setStatus('loading')
        

        const model = tf.sequential()
        model.add(tf.layers.dense({units: 1, inputShape: [1]}))
        model.compile({optimizer: 'sgd', loss:'meanSquaredError'})
        await new Promise(r => setTimeout(r, 500))

        clearTimeout(timeoutId)
        setStatus('ready')
      }catch(err: any){
        clearTimeout(timeoutId)
        setError(err.message)
      }
    }

    init()
    return () => controller.abort()
  }, [])

  return (
    <div className='p-8 max-w-md mx-auto space-y-4'>
      <h1 className='text-2x1 font-bold'>TF.js Model Loader</h1>

      {status === 'loading' && (
        <div className='flex items-center gap-2 text-blue-600'>
          <div className='w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin'></div>
          <span>Loading model... 15MB via WiFi</span>
        </div>
      )}

      {status === 'ready' && (
        <div className='text-green-600 front-bold'>Model ready. GPU: {tf.getBackend()}</div>
      )}

      {status === 'error' && (
        <div className='text-red-500'>
          Error: {error}
          <button onClick={() => window.location.reload()} className='ml-2 underline'>Retry</button>
        </div>
      )}
      <RagDrill6/>
      
    </div>
  )
}