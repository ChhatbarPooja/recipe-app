import { useState } from 'react'
// import FollowInstagram from './FollowInstagram'
import Footer from './Footer'
// import Header from './Header'
import Navbar from './Navbar'
import RecipeList from './RecipeList'
// import Subscribe from './Subscribe'

const Homepage = () => {
  const [load, setLoad] = useState(false);

  return (
    <div>
      {/* <Header /> */}
      {/* <div className='p-12'> */}
      <Navbar setLoad={setLoad}/>
      {/* <CarouselComponent />
      <Cards />
      <BestRecipe /> */}
      {/* </div> */}
      {/* <FreeRecipe /> */}
      <RecipeList load={load}/>
      {/* <Subscribe /> */}
      {/* <FollowInstagram /> */}
      {/* <Footer /> */}
    </div>
  )
}

export default Homepage