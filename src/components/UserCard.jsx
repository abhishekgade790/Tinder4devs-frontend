import React from 'react';

const UserCard = ({ firstName, lastName, age, gender, photoUrl, about, skills }) => (
  <div className="card w-full max-w-sm bg-base-300 rounded-2xl shadow-xl border border-base-300 pb-2">
    <figure className="px-2 pt-2 pb-1 md:px-6 md:pt-6 md:pb-2">
      <div className="avatar">
        <div className="w-full aspect-square rounded-2xl ring ring-primary ring-offset-base-100 ring-offset-2 overflow-hidden">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary to-secondary text-primary-content text-2xl font-bold">
              {firstName?.[0]}{lastName?.[0]}
            </div>
          )}
        </div>
      </div>
    </figure>

    <div className="card-body text-center">
      <h2 className="card-title justify-center text-primary">
        {firstName} {lastName}
      </h2>

      <div className="flex justify-center gap-2 mb-2">
        <div className="badge badge-secondary badge-outline">
          {age ? `${age} years` : 'Age not set'}
        </div>
        <div className="badge badge-accent badge-outline">
          {gender}
        </div>
      </div>

      <p className="text-base-content/70 text-sm mb-4">
        {about || 'No description provided'}
      </p>

      <div className="flex flex-wrap gap-1 justify-center">
        {skills.map((skill, index) => (
          <div key={index} className="badge badge-primary badge-sm">
            {skill}
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default UserCard;
