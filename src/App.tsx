import { Scene } from './Scene'

function App() {
  return (
    <div className="w-screen h-screen flex justify-center" style={{ height: "100vh" }}>
      <h1 className='fixed z-10 mx-auto text-blue-50 mt-20 text-3xl'>Hi Babi! Click to open the gift!</h1>
      <div className='absolute w-full h-full'>
        <Scene />
      </div>
    </div >
  )
}

export default App
