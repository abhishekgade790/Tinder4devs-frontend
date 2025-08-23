import axios from 'axios';
import React, { useState } from 'react';
import { BASE_URL } from '../utils/utils';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { addUser } from '../store/userSlice';
import { useNavigate } from 'react-router';

function Premium() {
    const [selectedPlan, setSelectedPlan] = useState('dev-pro');
    const [selectedDuration, setSelectedDuration] = useState('1');

    const user = useSelector((store) => store.user);
    const dispatch = useDispatch()
    const navigate = useNavigate();

    const plans = {
        'dev-pro': {
            name: 'Dev Pro',
            type: 'devpro',
            color: 'primary',
            features: [
                'Unlimited swipes & matches',
                'See who liked you',
                'Advanced tech stack filters',
                'Priority in match queue',
                'Basic portfolio showcase'
            ],
            prices: {
                '1': { monthly: 149, total: 149, savings: 0 },
                '3': { monthly: 129, total: 387, savings: 60 },
                '6': { monthly: 99, total: 594, savings: 300 }
            }
        },
        'code-master': {
            name: 'Code Master',
            type: 'codemaster',
            color: 'secondary',
            popular: true,
            features: [
                'Everything in Dev Pro',
                'Super likes (5 per day)',
                'Profile boost visibility',
                'Direct messaging without matching',
                'Advanced portfolio showcase',
                'GitHub integration',
                'Salary range visibility'
            ],
            prices: {
                '1': { monthly: 299, total: 299, savings: 0 },
                '3': { monthly: 249, total: 747, savings: 150 },
                '6': { monthly: 199, total: 1194, savings: 600 }
            }
        }
    };

    const verifyPremiumUser = async () => {
        console.log("verifying premium user");
        const res = await axios.get(BASE_URL + '/premium/verify', {
            withCredentials: true,
        });
        console.log(res.data.user);
        dispatch(addUser(res.data.user));
    }

    const handleBuyClick = async (planType, selectedDuration) => {
        const order = await axios.post(BASE_URL + '/payment/create', {
            membershipType: planType,
            duration: selectedDuration
        }, {
            withCredentials: true,
        })
        const { key, payment } = order.data;
        const { amount, currency, orderId, notes } = payment;
        console.log(order.data)
        console.log(key, amount, currency, orderId, notes);

        //should open the razorpay dialog box
        const options = {
            key: key, // Replace with your Razorpay key_id
            amount: amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
            currency: currency, // Use the currency from the order
            name: 'Tinder4Devs Premium',
            description: 'become a premium member',
            order_id: orderId, // This is the order_id created in the backend
            prefill: {
                name: notes.firstName + ' ' + notes.lastName,
                email: notes.email,
                contact: '9999999999'
            },
            theme: {
                color: '#7fdffd'
            },
            handler: function (response) {
                verifyPremiumUser();
            }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    const currentPlan = plans[selectedPlan];
    const currentPrice = currentPlan.prices[selectedDuration];

    return (
        user.isPremium ?
            <div className="min-h-screen flex items-center justify-center bg-base-100">
                <div className="text-center p-8 bg-white rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-4 text-green-600">You are already a Premium Member!</h2>
                    <p className="text-lg text-base-content/70 mb-6">Enjoy your premium features and happy coding!</p>
                    <button className="btn btn-primary" onClick={() => navigate('/')}>
                        Go to Home
                    </button>
                </div>
            </div>
            :
            <div className="min-h-screen bg-base-100">
                {/* Hero Section */}
                <div className="hero bg-gradient-to-r from-primary to-secondary text-primary-content py-16">
                    <div className="hero-content text-center">
                        <div className="max-w-md">
                            <h1 className="text-5xl font-bold">Level Up Your Code</h1>
                            <p className="py-6 text-lg">
                                Find your perfect dev match with premium features designed for serious developers
                            </p>
                            <div className="flex justify-center space-x-2">
                                <div className="badge badge-outline badge-lg">💻 Tech Stack Matching</div>
                                <div className="badge badge-outline badge-lg">🚀 Priority Visibility</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-12">
                    {/* Plan Selection */}
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Choose Your Plan</h2>
                        <p className="text-lg text-base-content/70">
                            Unlock premium features to accelerate your developer networking
                        </p>
                    </div>

                    {/* Plan Cards */}
                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
                        {Object.entries(plans).map(([planKey, plan]) => (
                            <div
                                key={planKey}
                                className={`card bg-base-100 shadow-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 ${selectedPlan === planKey
                                    ? `border-${plan.color} shadow-${plan.color}/20`
                                    : 'border-base-300'
                                    } ${plan.popular ? 'relative' : ''}`}
                                onClick={() => setSelectedPlan(planKey)}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="badge badge-secondary badge-lg px-4 py-2 font-semibold">
                                            MOST POPULAR
                                        </div>
                                    </div>
                                )}

                                <div className="card-body">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className={`text-2xl font-bold text-${plan.color}`}>
                                            {plan.name}
                                        </h3>
                                        <input
                                            type="radio"
                                            name="plan"
                                            className={`radio radio-${plan.color}`}
                                            checked={selectedPlan === planKey}
                                            onChange={() => setSelectedPlan(planKey)}
                                        />
                                    </div>

                                    <div className="space-y-3 mb-6">
                                        {plan.features.map((feature, index) => (
                                            <div key={index} className="flex items-center space-x-3">
                                                <div className={`w-2 h-2 rounded-full bg-${plan.color}`}></div>
                                                <span className="text-sm">{feature}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="text-center">
                                        <div className={`text-3xl font-bold text-${plan.color}`}>
                                            ₹{plan.prices['1'].monthly}/month
                                        </div>
                                        <div className="text-sm text-base-content/60">Starting price</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Duration Selection & Pricing */}
                    <div className="max-w-2xl mx-auto">
                        <div className="card bg-base-200 shadow-xl">
                            <div className="card-body">
                                <h3 className="text-2xl font-bold text-center mb-6">
                                    Complete Your {currentPlan.name} Selection
                                </h3>

                                {/* Duration Toggle Buttons */}
                                <div className="flex justify-center mb-6">
                                    <div className="join">
                                        {['1', '3', '6'].map((duration) => (
                                            <button
                                                key={duration}
                                                className={`btn join-item ${selectedDuration === duration
                                                    ? `btn-${currentPlan.color}`
                                                    : 'btn-outline'
                                                    }`}
                                                onClick={() => setSelectedDuration(duration)}
                                            >
                                                {duration} Month{duration !== '1' ? 's' : ''}
                                                {currentPlan.prices[duration].savings > 0 && (
                                                    <div className="badge badge-success badge-sm ml-2">
                                                        Save ₹{currentPlan.prices[duration].savings}
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Pricing Display */}
                                <div className="text-center mb-8">
                                    <div className="stats stats-horizontal shadow">
                                        <div className="stat">
                                            <div className="stat-title">Monthly Price</div>
                                            <div className={`stat-value text-2xl text-${currentPlan.color}`}>
                                                ₹{currentPrice.monthly}
                                            </div>
                                        </div>
                                        <div className="stat">
                                            <div className="stat-title">Total Price</div>
                                            <div className={`stat-value text-2xl text-${currentPlan.color}`}>
                                                ₹{currentPrice.total}
                                            </div>
                                        </div>
                                        {currentPrice.savings > 0 && (
                                            <div className="stat">
                                                <div className="stat-title">You Save</div>
                                                <div className="stat-value text-2xl text-success">
                                                    ₹{currentPrice.savings}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <div className="text-center">
                                    <button className={`btn btn-${currentPlan.color} btn-lg px-8`}
                                        onClick={() => handleBuyClick(currentPlan.type, selectedDuration)}>
                                        Subscribe to {currentPlan.name}
                                        <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </button>
                                    <p className="text-sm text-base-content/60 mt-3">
                                        Cancel anytime • 30-day money-back guarantee
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Comparison */}
                    <div className="max-w-6xl mx-auto mt-16">
                        <h3 className="text-2xl font-bold text-center mb-8">Feature Comparison</h3>
                        <div className="overflow-x-auto">
                            <table className="table table-zebra w-full">
                                <thead>
                                    <tr>
                                        <th>Features</th>
                                        <th className="text-center">Free</th>
                                        <th className="text-center text-primary">Dev Pro</th>
                                        <th className="text-center text-secondary">Code Master</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="font-semibold">Daily swipes</td>
                                        <td className="text-center">10</td>
                                        <td className="text-center">∞</td>
                                        <td className="text-center">∞</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">See who liked you</td>
                                        <td className="text-center">❌</td>
                                        <td className="text-center">✅</td>
                                        <td className="text-center">✅</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Advanced filters</td>
                                        <td className="text-center">Basic</td>
                                        <td className="text-center">✅</td>
                                        <td className="text-center">✅</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Super likes per day</td>
                                        <td className="text-center">1</td>
                                        <td className="text-center">1</td>
                                        <td className="text-center">5</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">Direct messaging</td>
                                        <td className="text-center">Match only</td>
                                        <td className="text-center">Match only</td>
                                        <td className="text-center">✅</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold">GitHub integration</td>
                                        <td className="text-center">❌</td>
                                        <td className="text-center">❌</td>
                                        <td className="text-center">✅</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-4xl mx-auto mt-16">
                        <h3 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h3>
                        <div className="space-y-4">
                            <div className="collapse collapse-plus bg-base-200">
                                <input type="radio" name="faq-accordion" defaultChecked />
                                <div className="collapse-title text-xl font-medium">
                                    Can I cancel my subscription anytime?
                                </div>
                                <div className="collapse-content">
                                    <p>Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your current billing period.</p>
                                </div>
                            </div>

                            <div className="collapse collapse-plus bg-base-200">
                                <input type="radio" name="faq-accordion" />
                                <div className="collapse-title text-xl font-medium">
                                    Do you offer a money-back guarantee?
                                </div>
                                <div className="collapse-content">
                                    <p>We offer a 30-day money-back guarantee. If you're not satisfied with your premium experience, contact us within 30 days for a full refund.</p>
                                </div>
                            </div>

                            <div className="collapse collapse-plus bg-base-200">
                                <input type="radio" name="faq-accordion" />
                                <div className="collapse-title text-xl font-medium">
                                    What happens to my matches if I downgrade?
                                </div>
                                <div className="collapse-content">
                                    <p>Your existing matches and conversations will remain intact. However, you'll lose access to premium features like seeing who liked you and advanced filters.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Premium;