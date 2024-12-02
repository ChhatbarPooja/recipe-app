import image from '../../images/bg-img/bg4.jpg';

const FreeRecipe = () => {
  return (
    <>
      <div className="bg-cover" style={{ backgroundImage: `url(${image})` }}>
        <div className="flex justify-center items-center">
          <div className='py-40'>
            <p className='flex justify-center text-white font-normal text-7xl'>Gluten Free Receipies</p>
            <p className='flex justify-center text-white font-normal text-base px-50 mt-10'>
              Fusce nec ante vitae lacus aliquet vulputate. Donec scelerisque
              accumsan molestie. Vestibulum ante ipsum primis in faucibus orci
              luctus et ultrices posuere cubilia Curae; Cras sed accumsan neque.
              Ut vulputate, lectus vel aliquam congue, risus leo elementum nibh
            </p>
            <div className='flex justify-center mt-10'>
            <button className='w-60 h-15 text-white text-base px-5 font-semibold capitalize mt-10 bg-[#40ba37]'>Discover all the receipies</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FreeRecipe;
