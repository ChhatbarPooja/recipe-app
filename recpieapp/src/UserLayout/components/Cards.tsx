import card2 from '../../images/bg-img/card2.jpg';
import card1 from '../../images/bg-img/card1.jpg';

const Cards = () => {
  return (
    <div className="container mx-auto">
      <div className="flex justify-around items-center ">
      <div className='w-1/2  '>
          <div className="rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between">
            <img src={card1} className='card-color' />
            <div className="m-11 absolute">
              <p className="text-white text-3xl mb-1 font-semibold">
              Strawberry Cake
              </p>
              <p className='font-normal text-base text-white'>Simple & Delicios
              </p>
            <button className='inline-block w-40 h-15 text-white text-base px-5 font-semibold capitalize mt-10 bg-[#40ba37]'>see full recipe</button>
          </div>
        </div>      
        </div>
        <div className='w-1/2'>
        <div className="rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between">
            <img src={card2} className='card-color' />
            <div className="m-11 absolute">
              <p className="text-white text-3xl mb-1 font-semibold">
              Chinesse Noodles
              </p>
              <p className='font-normal text-base text-white'>Simple & Delicios
              </p>
            <button className='inline-block w-40 h-15 text-white text-base px-5 font-semibold capitalize mt-10 bg-[#40ba37]'>see full recipe</button>
          </div>
        </div>      
        </div>
        </div>
      </div>
  
  );
};

export default Cards;
