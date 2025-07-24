import React, { useState } from 'react';
import UserCard from './userCard';
import axios from 'axios';
import { BASE_URL } from '../utils/utils';
import { useToast } from '../utils/ToastProvider';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/userSlice';
import { useNavigate } from 'react-router';



// Mock DatePicker component since react-datepicker is not available
const DatePicker = ({ selected, onChange, dateFormat, showYearDropdown, showMonthDropdown, dropdownMode, maxDate, className, placeholderText }) => (
  <input
    type="date"
    value={selected ? selected.toISOString().split('T')[0] : ''}
    onChange={(e) => onChange(e.target.value ? new Date(e.target.value) : null)}
    className={className}
    placeholder={placeholderText}
    max={maxDate ? maxDate.toISOString().split('T')[0] : undefined}
  />
);


function calculateAge(birthDateStr) {

  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function EditProfile({ user = {} }) {
  const [firstName, setFirstName] = useState(user.firstName || '');
  const [lastName, setLastName] = useState(user.lastName || '');
  const [gender, setGender] = useState(user.gender || 'Male');
  const [photoUrl, setPhotoUrl] = useState(user.photoUrl || '');
  const [birthDate, setBirthDate] = useState(
    user.birthDate ? new Date(user.birthDate) : null
  );
  const [skills, setSkills] = useState(user.skills || []);
  const [about, setAbout] = useState(user.about || '');
  const [isSaving, setIsSaving] = useState(false);


  const toast = useToast();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const age = birthDate ? calculateAge(birthDate.toISOString().split('T')[0]) : null;

  const handleSaveChanges = async () => {
    if (isSaving) return; // prevent duplicate clicks

    setIsSaving(true); // disable button

    try {
      const response = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          gender,
          photoUrl,
          skills,
          about,
          birthDate
        },
        { withCredentials: true }
      );
      toast.success("Profile Updated Successfully!", {
        duration: 3000,
      });
      dispatch(addUser(response.data.data));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        duration: 3000,
      });
    } finally {
      setTimeout(() => {
        setIsSaving(false);
      }, 2000); // re-enable after 2 seconds
    }
  };


  return user ? (
    <div className="min-h-screen bg-300">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Edit Profile</h1>
          <p className="text-base-content/70">Update your information and see the preview</p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">

          {/* Preview Card - Left Side */}
          <div className="order-2 xl:order-1">
            <div className="sticky top-8">
              <div className="bg-base-200 rounded-2xl p-6 shadow-lg border border-base-300">
                <h2 className="text-2xl font-semibold text-center mb-6 text-secondary">
                  Live Preview
                </h2>
                <div className="flex justify-center">
                  <UserCard
                    firstName={firstName}
                    lastName={lastName}
                    age={age}
                    gender={gender}
                    photoUrl={photoUrl}
                    about={about}
                    skills={skills}
                    _id={user._id}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form - Right Side */}
          <div className="order-1 xl:order-2">
            <div className="bg-base-200 rounded-2xl shadow-lg border border-base-300 overflow-hidden">
              <div className="bg-gradient-to-r from-primary to-secondary p-6">
                <h2 className="text-2xl font-bold text-primary-content text-center">
                  Profile Information
                </h2>
              </div>

              <div className="p-6 space-y-6">

                {/* Name Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control flex flex-col">
                    <label className="label">
                      <span className="label-text font-medium text-primary">First Name</span>
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="input input-bordered input-primary focus:input-primary  w-full"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div className="form-control flex flex-col">
                    <label className="label">
                      <span className="label-text font-medium text-primary">Last Name</span>
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="input input-bordered input-primary focus:input-primary w-full"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>

                {/* Profile Photo Section */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-primary">Profile Photo</span>
                  </label>
                  <div className="space-y-3">
                    <input
                      type="file"
                      className="file-input file-input-bordered file-input-primary w-full"
                      disabled
                    />
                    <div className="divider text-base-content/50">OR</div>
                    <input
                      type="url"
                      value={photoUrl}
                      onChange={(e) => setPhotoUrl(e.target.value)}
                      className="input input-bordered input-secondary focus:input-secondary w-full"
                      placeholder="Enter image URL"
                    />
                  </div>
                </div>

                {/* Birth Date & Gender */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control  flex flex-col">
                    <label className="label">
                      <span className="label-text font-medium text-primary">Birth Date</span>
                    </label>
                    <DatePicker
                      selected={birthDate}
                      onChange={(date) => setBirthDate(date)}
                      dateFormat="yyyy-MM-dd"
                      showYearDropdown
                      showMonthDropdown
                      dropdownMode="select"
                      maxDate={new Date()}
                      className="input input-bordered input-accent focus:input-accent  w-full"
                      placeholderText="Select birth date"
                    />
                  </div>
                  <div className="form-control flex flex-col">
                    <label className="label">
                      <span className="label-text font-medium text-primary">Gender</span>
                    </label>
                    <select
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="select select-bordered select-accent focus:select-accent w-full"
                    >
                      <option value="male">male</option>
                      <option value="female">female</option>
                      <option value="other">other</option>
                    </select>
                  </div>
                </div>

                {/* Skills */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-primary">Skills</span>
                    <span className="label-text-alt text-base-content/60">Comma-separated</span>
                  </label>
                  <input
                    type="text"
                    value={skills.join(', ')}
                    onChange={(e) =>
                      setSkills(
                        e.target.value
                          .split(',')
                          .map((s) => s.trim())
                          .filter((s) => s !== '')
                      )
                    }
                    className="input input-bordered input-secondary focus:input-secondary w-full"
                    placeholder="e.g., JavaScript, React, Node.js"
                  />
                  <label className="label">
                    <span className="label-text-alt text-info">
                      {skills.length} skill{skills.length !== 1 ? 's' : ''} added
                    </span>
                  </label>
                </div>

                {/* About Me */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text font-medium text-primary">About Me</span>
                    <span className="label-text-alt text-base-content/60">
                      {about.length}/500 characters
                    </span>
                  </label>
                  <textarea
                    className="textarea textarea-bordered textarea-primary focus:textarea-primary resize-none w-full"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Tell us about yourself, your interests, and what makes you unique..."
                    rows={4}
                    maxLength={500}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSaveChanges}
                    className="btn btn-primary flex-1 btn-lg"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <span className="loading loading-spinner mr-2" />
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>

                  <button className="btn btn-outline btn-secondary flex-1 btn-lg" onClick={() => window.location.reload()}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="text-center min-h-screen flex  justify-center items-center">
      <span className="loading loading-bars text-info loading-md"></span>
    </div>
  );
}

export default EditProfile;