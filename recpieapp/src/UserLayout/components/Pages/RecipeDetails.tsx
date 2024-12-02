import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfStroke } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarEmpty } from '@fortawesome/free-regular-svg-icons';
import { RecipeDetailsResponse } from '../../../types/recepeTypes';
import { useFetch } from '../../../hooks/useFetch';
import { Link, useParams } from 'react-router-dom';
import {
  useAddReviewMutation,
  useDeleteReviewMutation,
  useEditReviewMutation,
} from '../../api/review.api';
import { notify } from '../../../common/Toast';
import ConfirmationDialog from '../../../common/Alert';
import {
  FaThumbsDown,
  FaThumbsUp,
} from 'react-icons/fa';
import axios from 'axios';
import {FacebookIcon, FacebookShareButton, LinkedinIcon, LinkedinShareButton, TwitterIcon, TwitterShareButton, WhatsappIcon, WhatsappShareButton} from 'react-share'
import MetaTags from '../MetaTags';

const RecipeDetails: React.FC = () => {
  const param = useParams();
  const url = `http://localhost:3000/recipe/details/${param.id}`;
  const { data, loading, error, refetch } = useFetch<RecipeDetailsResponse>(url);
  const [rating, setRating] = useState<number | null>(null);
  const [videoModel, setVideoModel] = useState<any>(false);
  const [activeTab, setActiveTab] = useState('');
  const [comment, setComment] = useState<string>('');
  const [showDialog, setShowDialog] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const [showAllReviews, setShowAllReviews] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [reviewToEdit, setReviewToEdit] = useState<string | null>(null);
  const [editReview] = useEditReviewMutation();
  const [deleteReview] = useDeleteReviewMutation();
  const [addReview] = useAddReviewMutation();
  const userString: any = localStorage.getItem('user');
  const user = JSON.parse(userString);
  const userId = user?.id;
  const user_id = user?.id;
  const role = user?.role;

  const reviews = data?.reviews || [];
  const [likeCounts, setLikeCounts] = useState<{ [key: string]: number }>({});
  const [dislikeCounts, setDislikeCounts] = useState<{ [key: string]: number }>({})

  const shareUrl = window.location.href;

  const approvedReview = data?.reviews.filter(
    (item) => item.status == 'approved',
  );

  useEffect(() => {
    const tabKeys = [
      { key: 'eng', value: data?.recipe?.recipe_name_eng },
      { key: 'guj', value: data?.recipe?.recipe_name_guj },
      { key: 'hindi', value: data?.recipe?.recipe_name_hindi },
    ];
    const initialActiveTab = tabKeys.find(tab => tab.value)?.key || '';
    setActiveTab(initialActiveTab);
  }, [data]);

  const averageRatings =
    approvedReview?.length! > 0
      ? approvedReview!.reduce(
          (acc, review) => acc + Number(review.rating || 0),
          0,
        ) / approvedReview!.length
      : 0;

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmitReview = async () => {
    if (!userId) {
      notify('Please login', { type: 'error' });
    } else {
      try {
        setSubmitting(true);
        const reviewData = {
          user_id: userId,
          recipe_id: data?.recipe._id,
          rating,
          review: comment,
          recipe_title: data?.recipe.recipe_name_eng,
          approved: false,
        };
        if (editMode && reviewToEdit) {
          await editReview({ id: reviewToEdit, reviewData }).unwrap();
          notify(
            'Review updated successfully wait untill  admin approve your updated review',
            { type: 'success' },
          );
          setEditMode(false);
          setReviewToEdit(null);
        } else {
          await addReview(reviewData).unwrap();
          notify(
            'Review added successfully wait untill  admin approve your review',
            { type: 'success' },
          );
        }
        setRating(null);
        setComment('');
        setSubmitting(false);
        // refetch();
      } catch (err: any) {
        notify(err.data.error, { type: 'error' });
        setSubmitting(false);
      }
    }
  };

  const handleEditReview = (
    reviewId: string,
    existingRating: number,
    existingComment: string,
  ) => {
    setEditMode(true);
    setReviewToEdit(reviewId);
    setRating(existingRating);
    setComment(existingComment);
  };

  const handleDeleteClick = (_id: string) => {
    setSelectedReviewId(_id);
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    if (selectedReviewId) {
      try {
        await deleteReview(selectedReviewId);
        refetch();
        notify('Deleted successfully', { type: 'success' });
        window.location.reload();
      } catch (error) {
        notify('Error deleting review:', { type: 'error' });
      }
      setShowDialog(false);
      setSelectedReviewId(null);
    }
  };

  const cancelDelete = () => {
    setShowDialog(false);
    setSelectedReviewId(null);
  };

  const handleLike = async (review_id: string, recipe_id: string) => {
    if (!userId) {
      notify('Please login', { type: 'error' });
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3000/recipe/like`, {
        review_id,
        recipe_id,
        user_id: userId,
        like: true,
      });

      notify(res.data.message, { type: 'success' });
      setLikeCounts((prev) => ({
        ...prev,
        [review_id]: (prev[review_id] || 0) + 1,
      }));
      setDislikeCounts((prev) => ({
        ...prev,
        [review_id]: (prev[review_id] || 0) > 0 ? (prev[review_id] - 1) : 0,
      }));
    } catch (error:any) {
      console.error(error.response.data.message);
      notify(error.response.data.message, { type: 'error' });
    }
  };

  const handleDisLike = async (review_id: string, recipe_id: string) => {
    if (!userId) {
      notify('Please login', { type: 'error' });
      return;
    }

    try {
      const res = await axios.post(`http://localhost:3000/recipe/like`, {
        review_id,
        recipe_id,
        user_id: userId,
        like: false,
      });

      notify(res.data.message, { type: 'success' });
      setDislikeCounts((prev) => ({
        ...prev,
        [review_id]: (prev[review_id] || 0) + 1,
      }));
      setLikeCounts((prev) => ({
        ...prev,
        [review_id]: (prev[review_id] || 0) > 0 ? (prev[review_id] - 1) : 0,
      }));
    } catch (error:any) {
      console.error(error.response.data.message);
      notify(error.response.data.message, { type: 'error' });
    }
  };

  useEffect(() => {
    const initialLikeCounts:any = {};
    const initialDislikeCounts:any = {};

    reviews.forEach((review) => {
      initialLikeCounts[review._id] = review.likeCount || 0;
      initialDislikeCounts[review._id] = review.dislikeCount || 0;
    });

    setLikeCounts(initialLikeCounts);
    setDislikeCounts(initialDislikeCounts);
  }, [reviews]);

  // useEffect(() => {
  //   if (data) {
  //     // Dynamically set meta tags based on recipe details
  //     document.title = data?.recipe?.recipe_name_eng || 'Recipe Details';
  //     const metaDescription = document.querySelector('meta[name="description"]');
  //     if (metaDescription) {
  //       metaDescription.setAttribute(
  //         'content',
  //         data?.recipe?.ingredients_eng || 'Recipe details and instructions'
  //       );
  //     }

  //     const metaImage = document.querySelector('meta[property="og:image"]');
  //     if (metaImage) {
  //       metaImage.setAttribute(
  //         'content',
  //         `http://localhost:3000/${data?.recipe?.images}` || 'default-image.jpg'
  //       );
  //     }
  //   }
  // }, [data]);

  const approvedReviews = data?.reviews.filter(
    (review) => review.status == 'approved',
  );
  const reviewsToShow = showAllReviews
    ? approvedReviews
    : approvedReviews?.slice(0, 3);

   if (loading) return <div>Loading...</div>;
   if (error) return <div>Error: {error}</div>;

  return (
    <>
      <div itemScope itemType={shareUrl} className="container mx-auto p-10 bg-white">
      {data && (
        <MetaTags
          title={data.recipe.recipe_name_eng || 'Recipe title'}
          description={data.recipe.ingredients_eng || 'Recipe details and instructions'}
          image={`http://localhost:3000/${data.recipe.images}`}
        />
      )}
        <div className="flex justify-center">
          <img
            src={`http://localhost:3000/${data?.recipe.images}`}
            alt="Recipe Banner"
            className="w-100 h-80 max-h-90 mb-6 object-fill"
          />
        </div>
        <div className="flex  justify-center space-x-4 mb-4 ">
          {data?.recipe?.recipe_name_eng && (
            <button
              type="button"
              className={`py-2 px-4 ${
                activeTab === 'eng'
                  ? 'bg-green-500 text-white '
                  : 'bg-gray-300  font-bold'
              } rounded`}
              onClick={() => setActiveTab('eng')}
            >
              English
            </button>
          )}
          {data?.recipe?.recipe_name_hindi && (
            <button
              type="button"
              className={`py-2 px-4 ${
                activeTab === 'hindi'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300  font-bold'
              } rounded`}
              onClick={() => setActiveTab('hindi')}
            >
              Hindi
            </button>
          )}
          {data?.recipe?.recipe_name_guj && (
            <button
              type="button"
              className={`py-2 px-4 ${
                activeTab === 'guj'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-300  font-bold'
              } rounded`}
              onClick={() => setActiveTab('guj')}
            >
              Gujarati
            </button>
          )}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-2/3">
            <div className="recipe-headline my-5">
              <span className="text-m block text-gray-500 mb-0 ">
                <p className="text-xs text-[#40ba37] font-normal">
                  {new Date(data?.recipe?.createdAt!).toLocaleDateString(
                    'en-US',
                    {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    },
                  )}
                </p>
              </span>
              <h2 className="text-4xl  font-bold text-[#474747] mb-8 break-words ">
                {activeTab === 'eng' && <>{data?.recipe.recipe_name_eng}</>}
                {activeTab === 'guj' && <>{data?.recipe.recipe_name_guj}</>}
                {activeTab === 'hindi' && <>{data?.recipe.recipe_name_hindi}</>}
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
            {role == 'admin' ? (
              ''
            ) : (
              <div className="ratings flex space-x-1">
                {data?.reviews?.length! > 0 && approvedReview?.length! > 0 && (
                  <>
                    {[1, 2, 3, 4, 5].map((star) => {
                      let icon;

                      if (star <= Math.floor(averageRatings)) {
                        icon = faStar; // Full star
                      } else if (
                        star === Math.ceil(averageRatings) &&
                        !Number.isInteger(averageRatings)
                      ) {
                        icon = faStarHalfStroke; // Half star
                      } else {
                        icon = faStarEmpty; // Empty star
                      }
                      return (
                        <FontAwesomeIcon
                          key={star}
                          icon={icon}
                          className="text-yellow-500"
                        />
                      );
                    })}
                  </>
                )}
              </div>
            )}
            {data?.recipe.difficulty_level ? (
              <div className="recipe-ratings text-center my-5">
                <div className="mt-4 inline-block min-w-[160px] h-[60px] text-white border-l-4 border-[#1c8314] rounded-none px-[30px] text-lg leading-[58px] font-semibold transition duration-500 capitalize bg-green-500">
                  For {data?.recipe.difficulty_level}
                </div>
              </div>
            ) : (
              ''
            )}
          </div>
        </div>

        <div className="flex flex-wrap mt-10 gap-15">
          <div className="w-full lg:w-1/2 mb-8 lg:mb-0">
            <h4 className="text-gray-700 mb-8 text-[#474747] text-[1.5rem] font-bold">
              Steps
            </h4>
            <div className="single-preparation-step flex text-wrap w-20 flex-wrap mb-12">
              {activeTab === 'eng' && (
                <div
                  className="prose prose-sm text-[#474747] max-w-xs break-words"
                  dangerouslySetInnerHTML={{
                    __html: data?.recipe.recipe_steps_eng!,
                  }}
                />
              )}
              {activeTab === 'hindi' && (
                <div
                  className="prose prose-sm text-[#474747] max-w-xs break-words"
                  dangerouslySetInnerHTML={{
                    __html: data?.recipe.recipe_steps_hindi!,
                  }}
                />
              )}
              {activeTab === 'guj' && (
                <div
                  className="prose prose-sm text-[#474747] max-w-xs break-words"
                  dangerouslySetInnerHTML={{
                    __html: data?.recipe.recipe_steps_guj!,
                  }}
                />
              )}
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <div className="ingredients">
              <h4 className="text-gray-700 mb-8 text-[#474747] text-[1.5rem] font-bold">
                Ingredients
              </h4>
              {activeTab === 'eng' && (
                <div
                  className="prose prose-sm text-[#474747] max-w-xs break-words"
                  dangerouslySetInnerHTML={{
                    __html: data?.recipe.ingredients_eng!,
                  }}
                />
              )}
              {activeTab === 'guj' && (
                <div
                  className="prose prose-sm text-[#474747] max-w-xs break-words"
                  dangerouslySetInnerHTML={{
                    __html: data?.recipe.ingredients_guj!,
                  }}
                />
              )}
              {activeTab === 'hindi' && (
                <div
                  className="prose prose-sm text-[#474747] max-w-xs break-words"
                  dangerouslySetInnerHTML={{
                    __html: data?.recipe.ingredients_hindi!,
                  }}
                />
              )}
            </div>
          </div>
        </div>
        {data?.recipe.video_url &&
        <div className="flex">
          <h4 className="text-gray-700 mb-8 text-[#474747] text-[1.5rem] font-bold">
            Video Url :
          </h4>
          <Link
            to=""
            className="mt-2 ml-2 cursor-pointer text-green-600"
            onClick={() => setVideoModel(true)}
          >
            {data?.recipe.video_url}
          </Link>
        </div> }
        {videoModel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative bg-gray p-3 rounded-lg shadow-lg text-center z-10">
              <p
                className="flex justify-end cursor-pointer mr-[-10] font-medium text-xl"
                onClick={() => setVideoModel(false)}
              >
                x
              </p>
              <iframe
                width="560"
                height="315"
                className="relative"
                src={data?.recipe.video_url}
                title="GeeksforGeeks"
              ></iframe>
            </div>
          </div>
        )}
        {role == 'admin' ? (
          ' '
        ) : (
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
                onChange={(e) => setComment(e.target.value.trimStart())}
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
                  {submitting
                    ? 'Submitting...'
                    : editMode
                    ? 'Update'
                    : 'Submit'}
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
                      {review.user_id ? review.user_id!.user_name! : ''}
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
                    <p className="text-[#474747] max-w-xs break-words">{review.review}</p>
                    <div className="flex justify-end gap-2">
                      <div className="relative">
                        <button
                          className="px-3 py-1 bg-blue-500 border-2 border-blue-500 text-white rounded-lg"
                          onClick={() => handleLike(review._id, review.recipe_id)}
                        >
                          <FaThumbsUp />
                        </button>
                          <div className="t-0 absolute left-8.5 bottom-7.5">
                            <p className="flex h-2 w-2 items-center justify-center text-xs text-black">
                            {likeCounts[review._id] || review.likeCount}
                            </p>
                          </div>
                      </div>
                      <div className="relative">
                        <button
                          className="px-3 py-1 bg-red-500 text-white rounded-lg"
                          onClick={() => handleDisLike(review._id, review.recipe_id)}
                        >
                          <FaThumbsDown />
                        </button>{' '}
                        <div className="t-0 absolute left-8.5 bottom-7.5">
                          <p className="flex h-2 w-2 items-center justify-center text-xs text-black">
                          {dislikeCounts[review._id] || review.dislikeCount}
                          </p>
                        </div>
                      </div>

                      {userId == review.user_id!._id! ? (
                        <>
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded-lg"
                            onClick={() =>
                              handleEditReview(
                                review._id,
                                review.rating,
                                review.review,
                              )
                            }
                          >
                            Edit
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded-lg"
                            onClick={() => handleDeleteClick(review._id)}
                          >
                            Delete
                          </button>
                          {showDialog && (
                            <ConfirmationDialog
                              message="Are you sure you want to delete this review?"
                              onConfirm={confirmDelete}
                              onCancel={cancelDelete}
                            />
                          )}
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {!showAllReviews && approvedReviews?.length! > 3 && (
                <button
                  className="mt-4 px-6 py-2 bg-[#1c8314] text-white font-bold rounded-lg"
                  onClick={() => setShowAllReviews(true)}
                >
                  Load More Reviews
                </button>
              )}
            </div>
          </div>
        )}
      </div>
        <WhatsappShareButton url={shareUrl}>
          <WhatsappIcon size={40} round={true} />
        </WhatsappShareButton>
    </>
  );
};

export default RecipeDetails;
