import RecipeOnePhoto from '../../images/bg-img/r1.jpg';
import RecipeTwoPhoto from '../../images/bg-img/r2.jpg';
import RecipeThreePhoto from '../../images/bg-img/r3.jpg';
import RecipeFourPhoto from '../../images/bg-img/r4.jpg';
import RecipeFivePhoto from '../../images/bg-img/r5.jpg';
import RecipeSixPhoto from '../../images/bg-img/r6.jpg';


const BestRecipe = () => {
  return (
    <>
      <div className="container mx-auto">
        <p className="py-17 text-4xl text-black flex justify-center font-semibold">
          The best Receipies
        </p>
        <div className="grid grid-cols-3 gap-10">
          <div>
            <div>
              <img
                src={RecipeOnePhoto}
                className="border-b-green-600 border-b-4"
              />
            </div>
            <div className="my-8">
              <p className="flex justify-center text-xl font-normal text-black">
                Sushi Easy Receipy
              </p>
              <p className="flex justify-center pt-2">Ratings</p>
            </div>
          </div>

          <div>
            <div>
              <img
                src={RecipeTwoPhoto}
                className="border-b-green-600 border-b-4"
              />
            </div>
            <div className="my-8">
              <p className="flex justify-center text-xl font-normal text-black">
              Homemade Burger              </p>
              <p className="flex justify-center pt-2">Ratings</p>
            </div>
          </div>

          <div>
            <div>
              <img
                src={RecipeThreePhoto}
                className="border-b-green-600 border-b-4"
              />
            </div>
            <div className="my-8">
              <p className="flex justify-center text-xl font-normal text-black">
              Vegan Smoothie
              </p>
              <p className="flex justify-center pt-2">Ratings</p>
            </div>
          </div>

          <div>
            <div>
              <img
                src={RecipeFourPhoto}
                className="border-b-green-600 border-b-4"
              />
            </div>
            <div className="my-8">
              <p className="flex justify-center text-xl font-normal text-black">
              Calabasa soup
              </p>
              <p className="flex justify-center pt-2">Ratings</p>
            </div>
          </div>

          <div>
            <div>
              <img
                src={RecipeFivePhoto}
                className="border-b-green-600 border-b-4"
              />
            </div>
            <div className="my-8">
              <p className="flex justify-center text-xl font-normal text-black">
              Homemade Breakfast
              </p>
              <p className="flex justify-center pt-2">Ratings</p>
            </div>
          </div>

          <div>
            <div>
              <img
                src={RecipeSixPhoto}
                className="border-b-green-600 border-b-4"
              />
            </div>
            <div className="my-8">
              <p className="flex justify-center text-xl font-normal text-black">
              Healthy Fruit Desert
              </p>
              <p className="flex justify-center pt-2">Ratings</p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default BestRecipe;
