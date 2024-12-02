import Header from '../Header';
import Navbar from '../Navbar';
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { RecipeDetailsResponse } from '../../../types/recepeTypes';
import { useFetch } from '../../../hooks/useFetch';
import axios from 'axios';
// import { useAuth } from '../../../hooks/useAuth';
import { useParams } from 'react-router-dom';

const Recpies = () => {
  const param = useParams();

  const url = `http://localhost:3000/recipe/details/${param.id}`;
  // const { user } = useAuth();
  const { data, loading, error, refetch } = useFetch<RecipeDetailsResponse>(url);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState<string>('');
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  const averageRating =
    data?.reviews.reduce((acc, review) => acc + Number(review.rating), 0)! /
    data?.reviews.length!;

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmitReview = async () => {
    if (!rating || !comment) {
      alert('Please provide both a rating and a comment.');
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('http://localhost:3000/review', {
        user_id: "667d74acb59f59d589b88399",
        recipe_id: data?.recipe._id,
        rating,
        review: comment,
      });
      setRating(null);
      setComment('');
      setSubmitting(false);
      // refetch(); // Refetch data to include the new review
    } catch (err) {
      console.error(err);
      setSubmitting(false);
    }
  };

  const reviewsToShow = showAllReviews
    ? data?.reviews
    : data?.reviews.slice(0, 3);

  return (
    <>
      <Header />
      <Navbar />
      <div className="container mx-auto p-20 bg-white">
        <img
          src={`http://localhost:3000/${data?.recipe.images}`}
          alt="Recipe Banner"
          className="w-full h-auto mb-6"
        />
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <div className="recipe-headline my-5">
              <span className="text-m block text-gray-500 mb-0 ">
                April 05, 2018
              </span>
              <h2 className="text-4xl font-bold text-[#474747] mb-8">
              {data?.recipe.recipe_name_eng}
              </h2>
              <div className="recipe-duration border-l-4 border-[#1c8314] pl-4 py-3">
                <h6 className="text-sm mb-2 text-black font-bold text-[16px]">
                  Prep: {data?.recipe.preparation_time}
                </h6>
                <h6 className="text-sm mb-2 text-black font-bold text-[16px]">
                  Cook: {data?.recipe.cooking_time}
                </h6>
                <h6 className="text-sm text-black font-bold text-[16px]">
                  Yields: {data?.recipe.num_of_people_to_served} Servings
                </h6>
              </div>
            </div>
          </div>

          <div className="w-full md:w-1/3 flex flex-col items-end">
            <div className="recipe-ratings text-right my-5">
              <div className="ratings flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FontAwesomeIcon
                    key={star}
                    icon={star <= Math.round(averageRating) ? faStar : faStarEmpty}
                    className="text-yellow-500"
                  />
                ))}
              </div>
              <a
                href="#"
                className="mt-4 inline-block min-w-[160px] h-[60px] text-white border-l-4 border-[#1c8314] rounded-none px-[30px] text-lg leading-[58px] font-semibold transition duration-500 capitalize bg-green-500"
              >
                For {data?.recipe.difficulty_level}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mt-10">
          <div className="w-full lg:w-2/3 mb-8 lg:mb-0">
            {/* Single Preparation Step */}
            <div className="single-preparation-step flex mb-12">
              {/* <h4 className="text-gray-700 flex-none w-15 mb-0 text-[#474747] text-[1.5rem] font-bold">
                01.
              </h4>
              <p className="text-gray-500 text-base leading-loose font-normal text-[14px]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Vestibulum nec varius dui. Suspendisse potenti. Vestibulum ac
                pellentesque tortor. Aenean congue sed metus in iaculis. Cras a
                tortor enim. Phasellus posuere vestibulum ipsum, eget lobortis
                purus. Orci varius natoque penatibus et magnis dis parturient
                montes, nascetur ridiculus mus.
              </p> */}
              <div
            className="prose prose-sm text-[#474747]"
            dangerouslySetInnerHTML={{ __html: data?.recipe.recipe_steps_eng! }}
          />
            </div>
       
          </div>

          {/* Ingredients */}
          <div className="w-full lg:w-1/3">
            <div className="ingredients">
              <h4 className="text-gray-700 mb-8 text-[#474747] text-[1.5rem] font-bold">
                Ingredients
              </h4>
       
              {/* <div className="custom-control mb-8 flex items-center pl-10">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck2"
                />
                <label
                  className="custom-control-label ml-2 font-bold text-[16px] text-[#474747]"
                  htmlFor="customCheck2"
                >
                  2 large eggs
                </label>
              </div> */}
               <div
            className="prose prose-sm text-[#474747]"
            dangerouslySetInnerHTML={{ __html: data?.recipe.ingredients_eng! }}
          />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full lg:w-2/3 mb-8 lg:mb-0">
            <h2 className="text-xl font-semibold mb-2 text-[#474747]">
              Submit Your Review
            </h2>
            <div>
              {[1, 2, 3, 4, 5].map((star) => (
                <FontAwesomeIcon
                  key={star}
                  icon={star <= (rating || 0) ? faStar : faStarEmpty}
                  className="text-yellow-500 cursor-pointer ml-2"
                  onClick={() => handleRatingChange(star)}
                />
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment"
              rows={4}
              className="w-full mt-4 p-2 border rounded-lg"
            />
            <div className="text-center">
              <button
                className="mt-4 px-6 py-2 bg-[#1c8314] text-white font-bold rounded-lg"
                onClick={handleSubmitReview}
                disabled={submitting}
              >
                {submitting ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
          <div className="w-full lg:w-1/3">
            {reviewsToShow?.map((review) => (
              <div
                key={review._id}
                className="mb-4 p-4 bg-white rounded-lg shadow-lg"
              >
                <div className="p-2 bg-gray-100">
                  <h3 className="text-lg font-semibold text-[#474747]">
                    {review.user_id.user_name}
                  </h3>
                  <p>
                    {Array.from({ length: 5 }, (_, index) => (
                      <FontAwesomeIcon
                        key={index}
                        icon={index < review.rating ? faStar : faStarEmpty}
                        className="text-yellow-500"
                      />
                    ))}
                  </p>
                  <p className="text-[#474747]">{review.review}</p>
                </div>
              </div>
            ))}
            {!showAllReviews && data?.reviews.length! > 3 && (
              <button
                className="mt-4 px-6 py-2 bg-[#1c8314] text-white font-bold rounded-lg"
                onClick={() => setShowAllReviews(true)}
              >
                Load More Reviews
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Recpies;
