import Insta1 from '../../images/bg-img/insta1.jpg'
import Insta2 from '../../images/bg-img/insta2.jpg'
import Insta3 from '../../images/bg-img/insta3.jpg'
import Insta4 from '../../images/bg-img/insta4.jpg'
import Insta5 from '../../images/bg-img/insta5.jpg'
import Insta6 from '../../images/bg-img/insta6.jpg'
import Insta7 from '../../images/bg-img/insta7.jpg'

const FollowInstagram = () => {
  return (
   <>
    <div className="">
        <p className="text-lg font-semibold text-black py-8 container mx-auto">

        Follow Us Instragram
        </p>
        <div className="lg:flex md:flex lg:w-54">
            <img src={Insta1} className=' hover:opacity-50 bg-green-400 hover:cursor-pointer'/>
            <img src={Insta2} className=' hover:opacity-50 bg-green-400 hover:cursor-pointer'/>
            <img src={Insta3} className=' hover:opacity-50 bg-green-400 hover:cursor-pointer'/>
            <img src={Insta4} className=' hover:opacity-50 bg-green-400 hover:cursor-pointer'/>
            <img src={Insta5} className=' hover:opacity-50 bg-green-400 hover:cursor-pointer'/>
            <img src={Insta6} className=' hover:opacity-50 bg-green-400 hover:cursor-pointer'/>
            <img src={Insta7} className=' hover:opacity-50 bg-green-400 hover:cursor-pointer'/>
        </div>

    </div>
    </>
  )
}

export default FollowInstagram