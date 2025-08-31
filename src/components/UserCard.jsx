import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../utils/utils';
import { useToast } from '../utils/ToastProvider';
import { useDispatch } from 'react-redux';
import { removeUserFromFeed } from '../store/feedSlice';
import { BiCrown } from 'react-icons/bi';
import { Crown } from 'lucide-react';
import { CrownIcon } from 'lucide-react';

const UserCard = ({ firstName, lastName, age, gender, photoUrl, about, skills, _id, isPremium }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const toast = useToast();
  const dispatch = useDispatch();

  const handleMouseDown = (e) => {
    // Don't start dragging if clicking on buttons or interactive elements
    if (e.target.closest('button') || e.target.closest('.btn')) {
      return;
    }
    if (isAnimating) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || isAnimating) return;
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseUp = () => {
    if (isAnimating) return;
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      const isRight = dragOffset.x > 0;
      const status = isRight ? "interested" : "ignore";
      animateSwipe(isRight);
      handleSwipeAction(status, _id, firstName);
    } else {
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
    }
  };

  const animateSwipe = (isRight) => {
    setIsAnimating(true);
    setDragOffset({
      x: isRight ? 1000 : -1000,
      y: dragOffset.y + (Math.random() - 0.5) * 100
    });

    setTimeout(() => {
      dispatch(removeUserFromFeed(_id));
      setDragOffset({ x: 0, y: 0 });
      setIsDragging(false);
      setIsAnimating(false);
    }, 300);
  };

  const handleSwipeAction = async (status, _id, firstName) => {
    try {
      await axios.post(`${BASE_URL}/request/send/${status}/${_id}`, {}, { withCredentials: true });

      if (status === "interested") {
        toast.success(`You've shown interest in ${firstName}.`, {
          duration: 3000,
        });
      }

      if (status === "ignore") {
        toast.error(`You ignored ${firstName}.`, {
          duration: 3000,
        });
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong. Try again.", {
        duration: 3000,
      });
    }
  };

  const handleButtonClick = async (e, isLike, status, _id, firstName) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAnimating || isDragging) {
      return;
    }

    // Start animation immediately
    animateSwipe(isLike);

    // Handle API call separately
    handleSwipeAction(status, _id, firstName);
  };

  const getRotation = () => dragOffset.x * 0.1;
  const getOpacity = () => Math.max(0.5, 1 - Math.abs(dragOffset.x) / 200);

  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`relative w-80 h-[540px] rounded-2xl cursor-grab active:cursor-grabbing select-none ${isAnimating ? 'pointer-events-none' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) rotate(${getRotation()}deg)`,
          opacity: getOpacity(),
          transition: isDragging ? 'none' : 'transform 0.3s ease-out, opacity 0.3s ease-out'
        }}
      >
        {/* Swipe indicators */}
        <div className={`absolute z-20 top-8 left-8 px-4 py-2 bg-success text-success-content font-bold text-lg rounded-full transform -rotate-12 transition-opacity duration-200 shadow-lg ${dragOffset.x > 30 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            Interested
          </div>
        </div>
        <div className={`absolute z-20 top-8 right-8 px-4 py-2 bg-error text-error-content font-bold text-lg rounded-full transform rotate-12 transition-opacity duration-200 shadow-lg ${dragOffset.x < -30 ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
            Ignore
          </div>
        </div>

        <div className="w-full h-full bg-base-100 rounded-2xl shadow-2xl overflow-hidden border border-base-300 flex flex-col">
          {/* Photo */}
          <div className="relative h-2/3 overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="Profile" className="w-full h-full object-cover" draggable={false} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-primary-content text-4xl font-bold">
                {firstName?.[0]}{lastName?.[0]}
              </div>
            )}

            {/* Gradient and name */}
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-base-100/70 to-transparent" />
            <div className="absolute bottom-4 left-4 ">
              <h2 className="text-2xl font-bold">{firstName} {lastName} {age && (<span className='text-lg font-normal opacity-90'>({age})</span>)}</h2>
            </div>

            {/* is premium icon */}
            {isPremium && <div className='absolute top-4 right-4 btn btn-circle  border-none text-yellow-400  backdrop-blur-sm'>
              <CrownIcon />
            </div>}

            {/* Info toggle */}
            <button
              className="absolute bottom-4 right-4 btn btn-circle btn-sm bg-base-100/20 border-none text-base-100 hover:bg-base-100/30 backdrop-blur-sm"
              onClick={(e) => {
                e.stopPropagation();
                if (!isDragging && !isAnimating) {
                  setIsFlipped(!isFlipped);
                }
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
          </div>

          {/* Info & Skills */}
          <div className="h-1/3 px-4 py-4 flex flex-col justify-between bg-base-200">
            {!isFlipped ? (
              <>
                <p className="text-base-content/70 text-sm line-clamp-2 mb-3">
                  {about || 'No description provided'}
                </p>
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-base-content/60 font-medium">Skills:</span>
                    <div className="flex gap-1 flex-wrap">
                      {skills?.length === 0 && (
                        <p className="text-sm text-base-content/60 font-medium">No skills provided</p>
                      )}
                      {skills?.slice(0, 3).map((skill, index) => (
                        <div key={index} className="badge badge-primary badge-sm">{skill}</div>
                      ))}
                      {skills?.length > 3 && (
                        <span
                          className="text-sm text-base-content/60 cursor-pointer hover:text-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isDragging && !isAnimating) {
                              setIsFlipped(!isFlipped);
                            }
                          }}
                        >
                          +{skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex justify-center gap-4">
                    <button
                      className={`btn btn-md w-3/7 btn-error hover:btn-error shadow-lg ${(isAnimating || isDragging) ? 'opacity-50' : ''}`}
                      onClick={(e) => {
                        handleButtonClick(e, false, "ignore", _id, firstName);
                      }}
                      style={{ pointerEvents: (isAnimating || isDragging) ? 'none' : 'auto' }}
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                      </svg>
                    </button>
                    <button
                      className={`btn btn-md w-3/7 btn-success hover:btn-success shadow-lg ${(isAnimating || isDragging) ? 'opacity-50' : ''}`}
                      onClick={(e) => {
                        handleButtonClick(e, true, "interested", _id, firstName);
                      }}
                      style={{ pointerEvents: (isAnimating || isDragging) ? 'none' : 'auto' }}
                    >
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-3 overflow-y-auto h-full scrollbar-hide">
                <h3 className="text-sm font-semibold text-base-content mb-3">Skills & Info</h3>
                <div className="grid grid-cols-3 gap-2">
                  {skills?.map((skill, index) => (
                    <div key={index} className="badge badge-outline badge-sm">
                      {skill}
                    </div>
                  ))}
                </div>
                {age && <div className="text-sm text-base-content/70"><span className="font-medium text-base-content">Age:</span> {age}</div>}
                {gender && <div className="text-sm text-base-content/70"><span className="font-medium text-base-content">Gender:</span> {gender}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;