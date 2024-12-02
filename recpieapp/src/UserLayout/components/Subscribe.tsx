import subscribLogo from '../../images/bg-img/add.png'
import subscribBackground from '../../images/bg-img/bg1.jpg'

const Subscribe = () => {
  return (
    <>
      <div className='mx-10'>
        <div className="lg:flex gap-10">
          <div className=" border-8 border-green-500 p-10">
            <span className="text-5xl italic mb-8 text-[#40ba37] flex justify-center">"</span>
            <p className="text-2xl italic mb-10 font-semibold">
              Nothing is better than going home to family and eating good food
              and relaxing
            </p>
            <p className='flex justify-center'>John Smith</p>
            <div className='flex justify-between pt-10'>
              <p className="text-[#40ba37]">
                January 04, 2018
              </p>
              <p>2 Comments</p>
            </div>
          </div>

          <div>
            <p className='text-2xl text-black mb-10 font-semibold'>Subscribe to our newsletter</p>
            <div className='bg-cover h-95' style={{backgroundImage:`url(${subscribBackground})`}}>
              <div className='p-5'> 
              <p>

              <input type="text" placeholder='Subscribe to newsletter' className='lg:w-94 w-50 h-15 text-base px-5 font-semibold capitalize mt-10 ' />
              </p>
              <button className='lg:w-94 w-50 h-15 text-white text-base px-5 font-semibold capitalize mt-8 bg-[#40ba37]'>submit</button>
              <p className='mt-10 italic text-white text-xs'>Fusce nec ante vitae lacus aliquet vulputate. Donec sceleri sque accumsan molestie. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia.</p>
              </div>
            </div>
          </div>

            <img src={subscribLogo} className='mt-5 lg:mt-0'/>

        </div>

      </div>
        <hr className='mt-20 text-slate-300'></hr>
    </>
  );
};

export default Subscribe;
