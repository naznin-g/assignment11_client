import React, { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useNavigate, useLoaderData } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';

const ReportIssue = () => {
    const { user } = useAuth();
    const { register, control,handleSubmit, formState: { errors } } = useForm();
    const axiosSecure = useAxiosSecure();
    const navigate = useNavigate();
    const [issueCount, setIssueCount] = useState(0);
    const [isBlocked, setIsBlocked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await axiosSecure.get(`/citizen/${user?.email}`);
                setIssueCount(res.data.issuesCount);
                setIsBlocked(res.data.blocked);
                setIsSubscribed(res.data.subscribed);
            } catch (err) {
                console.error(err);
            }
        };
        if (user) fetchUserData();
    }, [user, axiosSecure]);
     const serviceCenters = useLoaderData();

    const regionsDuplicate=serviceCenters.map(c=>c.region)
    const regions = [...new Set(regionsDuplicate)];

// Watch selected region from form
            const region = useWatch({
  control,
  name: 'region'
});

    const districtsByRegion = (region) => {
        const regionDistricts = serviceCenters.filter(c => c.region === region);
        const districts = regionDistricts.map(d => d.district);
        return districts;
    }
    const handleReport = async (data) => {
        if (isBlocked) {
            Swal.fire('Blocked!', 'You are blocked and cannot submit issues.', 'warning');
            return;
        }

        if (!isSubscribed && issueCount >= 3) {
            Swal.fire({
                title: 'Limit Reached',
                text: 'Free users can only submit 3 issues. Subscribe to report more.',
                icon: 'info',
                confirmButtonText: 'Go to Profile',
            }).then(() => navigate('/profile'));
            return;
        }

        try {
            // Upload image
            const formData = new FormData();
            formData.append('image', data.image[0]);
            const imageRes = await fetch(`https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`, {
                method: 'POST',
                body: formData
            });
            const imageData = await imageRes.json();
            const photoURL = imageData.data.url;

            // Prepare issue payload
            const issuePayload = {
                title: data.title,
                description: data.description,
                category: data.category,
                image: photoURL,
                location: {
                district: data.district,
                region: data.region,
                address: data.location,
                },

                status: 'pending',
                priority: 'normal',
                createdBy:user?.email,
                createdAt:new Date()
            };

            // Save issue in backend
            const res = await axiosSecure.post('/issues', issuePayload);

            if (res.data.insertedId) {
                // Optionally, create a tracking record
              //  await axiosSecure.post('/citizen/issues/tracking', {
                //    issueId: res.data.insertedId,
                  //  status: 'pending',
                    //actionBy: user?.email,
                //});
                
                Swal.fire('Success!', 'Issue reported successfully.', 'success');
                navigate('/my-dashboard/my-issues');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', 'Failed to report issue. Try again.', 'error');
        }
    };

    return (
        <div className="p-8 max-w-lg mx-auto">
            <h2 className="text-3xl mb-4">Report a New Issue</h2>
            <form onSubmit={handleSubmit(handleReport)} className="space-y-4">
                <div>
                    <label className="label">Title</label>
                    <input
                        type="text"
                        placeholder="Issue title"
                        {...register('title', { required: true })}
                        className="input input-bordered w-full"
                    />
                    {errors.title && <span className="text-red-500">Title is required</span>}
                </div>

                <div>
                    <label className="label">Description</label>
                    <textarea
                        placeholder="Describe the issue"
                        {...register('description', { required: true })}
                        className="textarea textarea-bordered w-full"
                    ></textarea>
                    {errors.description && <span className="text-red-500">Description is required</span>}
                </div>

                <div>
                    <label className="label">Category</label>
                    <select
                        {...register('category', { required: true })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select Category</option>
                        <option value="streetlight">Streetlight</option>
                        <option value="pothole">Pothole</option>
                        <option value="water-leak">Water Leakage</option>
                        <option value="garbage">Garbage Overflow</option>
                        <option value="footpath">Damaged Footpath</option>
                        <option value="other">Other</option>
                    </select>
                    {errors.category && <span className="text-red-500">Category is required</span>}
                </div>

                <div>
                    <label className="label">Upload Image</label>
                    <input
                        type="file"
                        {...register('image', { required: true })}
                        className="file-input file-input-bordered w-full"
                    />
                    {errors.image && <span className="text-red-500">Image is required</span>}
                </div>

                <div>
                    <label className="label">Location</label>
                    <fieldset className="fieldset">
                            <legend className="fieldset-legend"> Region</legend>
                    <select {...register('region')} defaultValue="Pick a region" className="select">
                                <option disabled={true}>Pick a region</option>
                                {
                                    regions.map((r, i) => <option key={i} value={r}>{r}</option>)
                                }
                            </select>
                            </fieldset>

                    <fieldset className="fieldset w-full">
                            <legend className="fieldset-legend"> Districts</legend>
                            <select {...register('district')} defaultValue="Pick a district" className="select">
                                <option disabled={true}>Pick a district</option>
                                {
                                    districtsByRegion(region).map((r, i) => <option key={i} value={r}>{r}</option>)
                                }
                            </select>
                        </fieldset>
                        <fieldset className="fieldset">
  <legend className="fieldset-legend">Address</legend>

  <textarea
    className="textarea textarea-bordered"
    placeholder="Enter full address"
    rows={3}
    {...register('address', { required: true })}
  ></textarea>
</fieldset>

                    {errors.location && <span className="text-red-500">Location is required</span>}
                </div>

                <button type="submit" className="btn btn-primary w-full mt-4">
                    Submit Issue
                </button>
            </form>
        </div>
    );
};

export default ReportIssue;

