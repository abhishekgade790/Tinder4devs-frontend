import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BASE_URL } from '../utils/utils';
import { addRequests, removeUserFromRequests } from '../store/requestSlice';

const Requests = () => {
    const dispatch = useDispatch();
    const requests = useSelector(state => state.requests);

    const fetchRequests = async () => {
        try {
            const res = await axios.get(`${BASE_URL}/user/requests/received`, { withCredentials: true });
            dispatch(addRequests(res?.data?.connectionRequests || []));
        } catch (error) {
            console.error("Failed to fetch requests", error);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            await axios.post(`${BASE_URL}/request/review/accepted/${requestId}`, {}, { withCredentials: true });
            dispatch(removeUserFromRequests(requestId));
        } catch (error) {
            console.error("Accept failed", error);
        }
    };

    const handleReject = async (requestId) => {
        try {
            await axios.post(`${BASE_URL}/request/review/accepted/${requestId}`, {}, { withCredentials: true });
            dispatch(removeUserFromRequests(requestId));
        } catch (error) {
            console.error("Reject failed", error);
        }
    };

    useEffect(() => {
        if (!requests || requests.length === 0) {
            fetchRequests();
        }
    }, []);

    if (!requests) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-center">
                    <div className="loading loading-spinner loading-lg text-primary mb-4"></div>
                    <p className="text-lg text-base-content/70">Loading your Requests...</p>
                </div>
            </div>
        );
    }
    if (requests.length === 0) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-center">
                    <p className="text-lg text-base-content/70">You don't have recieved any Requests.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen'>
            {/* Header */}
            <div className="max-w-3xl mx-auto my-8">
                <h1 className="text-3xl font-bold text-primary mb-1">Requests Recieved</h1>
                <p className="text-base-content/70">
                    You Recieved {requests.length} developer Request{requests.length !== 1 ? 's' : ''}.
                </p>
            </div>
            <div className="max-w-3xl mx-auto rounded-lg shadow-md divide-y divide-base-300">
                {requests.map((req) => {
                    const { firstName, lastName, photoUrl, about, skills } = req.fromUserId;
                    return (
                        <div key={req._id} className="bg-base-200 my-2 rounded-lg p-4 flex items-center justify-between hover:bg-base-300 transition-all">
                            <div className="flex items-center">
                                <img
                                    src={photoUrl || "https://tse2.mm.bing.net/th/id/OIP.W3Do-GTQuxzJ5cL288waCAHaHa?pid=Api&P=0&h=180"}
                                    alt={firstName}
                                    className="w-14 h-14 rounded-full object-cover ring ring-primary ring-offset-base-100 mr-4"
                                />
                                <div>
                                    <h3 className="font-semibold text-lg">{firstName} {lastName}</h3>
                                    <p className="text-sm text-base-content/70 line-clamp-2">{about}</p>

                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 mt-4 sm:mt-0">
                                <button
                                    onClick={() => handleAccept(req._id)}
                                    className="btn btn-sm btn-accent"
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleReject(req._id)}
                                    className="btn btn-sm btn-outline btn-secondary"
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Requests;
