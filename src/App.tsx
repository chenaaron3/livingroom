import { Scene } from './Scene'

function App() {
  return (
    <div className="w-screen h-screen flex justify-center" style={{ height: "100vh" }}>
      <div className='absolute z-10 text-3xl pl-7 m-5 text-white w-full'>
        What's in the Box?
      </div>
      <div className='absolute w-full h-full'>
        <Scene />
      </div>
    </div >
  )
}

export default App
