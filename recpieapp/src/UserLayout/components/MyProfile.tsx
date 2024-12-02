import axios from 'axios';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { GetCountries, GetState, GetCity } from 'react-country-state-city';
import 'react-country-state-city/dist/react-country-state-city.css';
import Logo from '../../images/user/user.png';
import { notify } from '../../common/Toast';
import ConfirmationDialog from '../../common/Alert';

interface UserData {
  user_name: string;
  email: string;
  gender: string;
  dob: string;
  country: string;
  city: string;
  state: string;
  pincode: string;
  images: File | null;
}

const MyProfile = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [countriesList, setCountriesList] = useState<any[]>([]);
  const [stateList, setStateList] = useState<any[]>([]);
  const [cityList, setCityList] = useState<any[]>([]);
  const [preview, setPreview] = useState<any>('')
  const [removeImage, setRemoveImage] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  // const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const user = JSON.parse(localStorage.getItem('user') as any);
  const id = user.id;
  const inputRef = useRef<HTMLInputElement>(null); // Create a ref for the file input
  const [formErrors, setFormErrors] = useState({
    pincode: '',
  });



  const [userData, setUserData] = useState<UserData>({
    user_name: '',
    email: '',
    gender: '',
    dob: '',
    country: '',
    city: '',
    state: '',
    pincode: '',
    images: null,
  });

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/auth/userDetails/${id}`);
        const userDetails = response?.data;
        setUserData(userDetails);
        const countries = await GetCountries();
        setCountriesList(countries);
        setSelectedCountry(userDetails.country);
        const states = await GetState(countries.find((c: any) => c.name === userDetails.country)?.id || 0);
        setStateList(states);
        setSelectedState(userDetails.state);
        const cities = await GetCity(countries.find((c: any) => c.name === userDetails.country)?.id || 0, states.find((s: any) => s.name === userDetails.state)?.id || 0);
        setCityList(cities);
        setSelectedCity(userDetails.city);
      } catch (error) {
        console.log(error);
      }
    };
    getUserDetails();
  }, [id]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const countries = await GetCountries();
        setCountriesList(countries);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    fetchCountries();
  }, []);
  let curr = new Date();
  curr.setDate(curr.getDate());
  let date = curr.toISOString().substring(0, 10);
  useEffect(() => {
    if (selectedCountry) {
      const countryId = countriesList.find(c => c.name === selectedCountry)?.id || 0;
      if (countryId) {
        GetState(countryId).then((states: SetStateAction<any[]>) => {
          setStateList(states);
        });
      }
    }
  }, [selectedCountry, countriesList]);

  useEffect(() => {
    if (selectedState) {
      const countryId = countriesList.find(c => c.name === selectedCountry)?.id || 0;
      const stateId = stateList.find(s => s.name === selectedState)?.id || 0;
      if (countryId && stateId) {
        GetCity(countryId, stateId).then((cities: SetStateAction<any[]>) => {
          setCityList(cities);
        });
      }
    }
  }, [selectedState, stateList, selectedCountry, countriesList]);

  const handleInputChange = (key: keyof UserData, value: string | number | boolean | File | null) => {
    setUserData({
      ...userData,
      [key]: value,
    });
  };
  const handleDeleteClick = () => {
    setShowDialog(true);
  };

  const confirmDelete = async () => {
    // e.preventDefault();
    setPreview('');
    setRemoveImage(true);
    setUserData({ ...userData, images: null } as any);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setShowDialog(false);
  };

  const cancelDelete = () => {
    setShowDialog(false);
  };

  const validateForm = () => {
    const errors = {
      pincode: '',
    };

    if (userData?.pincode && String(userData.pincode).length >= 6) {
      errors.pincode = 'Pincode must be less than 6 digits';
    }

    setFormErrors(errors);
    return !Object.values(errors).some(error => error);
  };


  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const formData = new FormData();
    formData.append('user_name', userData.user_name!);
    formData.append('email', userData.email!);
    formData.append('gender', userData.gender!);
    formData.append('dob', userData.dob!);
    formData.append('country', selectedCountry);
    formData.append('city', selectedCity);
    formData.append('state', selectedState);
    formData.append('pincode', userData.pincode!);
    if (removeImage) {
      formData.append('change_image', 'true');
    }
    if (userData.images) {
      formData.append('images', userData.images);
    } else {
      formData.append('images', '');
    }
    try {
      await axios.put(`http://localhost:3000/auth/userDetails/${id}`, formData);
      notify("Profile Updated successfully ", {type:'success'})
    } catch (error) {       notify("Something went wrong ", {type:'error'})
  }
  };

  // const handleRemoveImage = (e: any) => {
  //   e.preventDefault();
  //   setPreview('');
  //   setRemoveImage(true);
  //   setUserData({ ...userData, images: null } as any);
  //   if (inputRef.current) {
  //     inputRef.current.value = '';
  //   }
  // };

  return (
    <div>
      <div className="flex justify-center py-10 text-xl font-medium">
        My Profile
      </div>
      <div className="flex">
        <form className="max-w-md mx-auto" onSubmit={handleSubmit}>
          <div className="mb-5">
            <div className="flex justify-center mb-2">
              <img
              src={preview || (userData?.images && !removeImage) ? preview || `http://localhost:3000/${userData.images}` : Logo}
              className="w-40 h-40 rounded-full"
              alt="profile-picture"
            />
            </div>
            <div className='flex'>
            {/* <input
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={(e) =>
               { handleInputChange(
                  'images',
                  e.target.files ? e.target.files[0] : null,
                ) ; setPreview(URL.createObjectURL(e.target.files![0])) ; setRemoveImage(false)}
              }
              ref={inputRef}
            /> */}
             <input
              type="file"
              accept=".jpg,.jpeg,.png"
              className="cursor-pointer"
              onChange={(e) => {
                const file = e.target.files ? e.target.files[0] : null;
                if (file) {
                  const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
                  if (validTypes.includes(file.type)) {
                    handleInputChange('images', file);
                    setPreview(URL.createObjectURL(file));
                    setRemoveImage(false)
                  } else {
                    e.target.value = '';
                    notify(
                      'Invalid file type. Please select a .jpg, .jpeg, or .png file.',
                      { type: 'error' },
                    );
                  }
                }
              }}
              ref={inputRef}
            />
            <div className='border-2 cursor-pointer py-1 px-1 rounded w-30' onClick={handleDeleteClick as any}>Remove Image</div>
            </div>
          </div>
          {showDialog && (
            <ConfirmationDialog
              message="Are you sure you want to delete this Profile image?"
              onConfirm={confirmDelete}
              onCancel={cancelDelete}
            />
          )}

          <div className="relative z-0 w-full mb-5 group">
            <label
              htmlFor="floating_email"
              className=" mb-5  text-xs"
            >
              Email address :
            </label>
            <input
              type="email"
              disabled
              defaultValue={userData?.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              name="floating_email"
              id="floating_email"
              className="bg-gray-50 cursor-not-allowed border bg-[#e1dcdc] text-sm rounded-lg  block w-90 p-2.5"
              placeholder=" "
            />
          </div>

          <div className="grid md:grid-cols-2 md:gap-6">
            <div className="relative z-0 w-full mb-3 group">
              <label
                htmlFor="floating_first_name"
                className=" mb-5  text-xs"
                >
                User name<span className='text-red-500'>*</span>
              </label>
              <input
                type="text"
                defaultValue={userData?.user_name}
                onChange={(e) =>
                  handleInputChange('user_name', e.target.value)
                }
                name="floating_first_name"
                id="floating_first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-90 p-2.5"
                placeholder=" "
                required
              />
            </div>
          </div>

          <div className="flex gap-5 my-2 ">
            <label
              className="text-xs text-gray-500 dark:text-gray-400 duration-300 transform"
            >
              Gender :
            </label>
            <div className="flex items-center">

              <input
                id="default-radio-1"
                type="radio"
                value="male"
                checked={userData?.gender === 'male'}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                name="default-radio"
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-radio-1"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Male
              </label>
            </div>
            <div className="flex items-center">
              <input
                id="default-radio-2"
                type="radio"
                value="female"
                checked={userData?.gender === 'female'}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                name="default-radio"
                className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 dark:focus:ring-green-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <label
                htmlFor="default-radio-2"
                className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              >
                Female
              </label>
            </div>
          </div>

          <div className="relative z-0 w-full mb-3 group pt-3">
            <label
              htmlFor="floating_date"
              className=" mb-5  text-xs"
              >
              Date of Birth
            </label>
            <input
              type="date"
              defaultValue={userData?.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              name="floating_date"
              id="floating_date"
              max={date}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-90 p-2.5"
              placeholder=" "
            />
          </div>

          <div className="relative z-0 w-full mb-3 group">
            <label
              htmlFor="country"
              className=" mb-5  text-xs"
              >
              Country
            </label>
            <select
              id="country"
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                handleInputChange('country', e.target.value);
              }}
              className=" border  bg-white text-sm rounded-lg  block w-90 p-2.5"
            >
              <option value="" disabled>Select Country</option>
              {countriesList.map((country) => (
                <option key={country.id} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative z-0 w-full mb-3 group">
            <label
              htmlFor="state"
              className=" mb-5  text-xs"
              >
              State
            </label>
            <select
              id="state"
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                handleInputChange('state', e.target.value);
              }}
              className="bg-white border  text-sm rounded-lg  block w-90 p-2.5"
            >
              <option value="" disabled>Select State</option>
              {stateList.map((state) => (
                <option key={state.id} value={state.name}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative z-0 w-full mb-3 group">
            <label
              htmlFor="city"
              className="text-xs"
              >
              City
            </label>
            <select
              id="city"
              value={selectedCity}
              onChange={(e) => {
                setSelectedCity(e.target.value);
                handleInputChange('city', e.target.value);
              }}
              className="bg-white border text-sm rounded-lg  block w-90 p-2.5"
            >
              <option value="" disabled>Select City</option>
              {cityList.map((city) => (
                <option key={city.id} value={city.name}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>

          <div className="relative z-0 w-full mb-5 group">
            <label
              htmlFor="floating_pincode"
              className=" text-xs"
              >
              Pincode
            </label>
            <input
              type="number"
              value={userData?.pincode || ''}
              onChange={(e) => handleInputChange('pincode', e.target.value)}
              name="floating_pincode"
              id="floating_pincode"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg  block w-90 p-2.5"
              placeholder=" "
            />
           {formErrors.pincode && <p className='text-red-500'>{formErrors.pincode}</p>}
          </div>

          <button type="submit" className="w-90 text-white bg-green-500 focus:ring-4 focus:outline-none  font-medium rounded-lg text-sm px-5 py-2.5 text-center "
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default MyProfile;