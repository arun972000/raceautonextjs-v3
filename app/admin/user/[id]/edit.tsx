"use client";
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Form } from "react-bootstrap";
import { useParams } from "next/navigation";

const EditUser = () => {
  const { id } = useParams();

  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [slug, setSlug] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [facebookUrl, setFacebookUrl] = useState("");
  const [twitterUrl, setTwitterUrl] = useState("");
  const [instagramUrl, setInstagramUrl] = useState("");
  const [pinterestUrl, setPinterestUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [vkUrl, setVkUrl] = useState("");
  const [telegramUrl, setTelegramUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [role, setRole] = useState("");
  const [plan, setPlan] = useState<any>(0);
  const [rolesTypes, setRoleTypes] = useState([]);
  const [planDuration, setPlanDuration] = useState("annual");
  const [subscriptionData, setSubscriptionData] = useState([]);
  const roleData = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/role/roles`
      );

      const subscriptionRes = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/subscription/user_id/${id}`
      );

      setRoleTypes(res.data);
      setSubscriptionData(subscriptionRes.data);
      const date1 = new Date(subscriptionRes.data[0].start_date);
    const date2 = new Date(subscriptionRes.data[0].end_date);

    // Calculate the difference in milliseconds
    const differenceInMs = date2.getTime() - date1.getTime();
    
    // Convert milliseconds to days
    const differenceInDays = differenceInMs / (1000 * 60 * 60 * 24);

    // Determine if it's Monthly (<31 days) or Annual (≥365 days)
    if (differenceInDays < 31) {
      setPlanDuration("monthly");
    } else if (differenceInDays >= 365) {
      setPlanDuration("annual");
    }
    } catch (err) {
      console.log(err);
    }
  };

  const formDataApi = async () => {
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/user/${id}`
      );
      const data = res.data[0];
      setEmail(data.email);
      setUsername(data.username);
      setSlug(data.slug);
      setAboutMe(data.about_me);
      setFacebookUrl(data.facebook_url);
      setTwitterUrl(data.twitter_url);
      setInstagramUrl(data.instagram_url);
      setPinterestUrl(data.pinterest_url);
      setLinkedinUrl(data.linkedin_url);
      setVkUrl(data.vk_url);
      setRole(data.role);
      setPlan(data.subscription);
      setTelegramUrl(data.telegram_url);
      setYoutubeUrl(data.youtube_url);
    } catch (err) {
      console.log(err);
    }
  };

  const EditApi = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("username", username);
      formData.append("slug", slug);
      formData.append("role", role);
      formData.append("subscription", plan);
      formData.append("about_me", aboutMe);
      formData.append("facebook_url", facebookUrl);
      formData.append("twitter_url", twitterUrl);
      formData.append("instagram_url", instagramUrl);
      formData.append("pinterest_url", pinterestUrl);
      formData.append("linkedin_url", linkedinUrl);
      formData.append("vk_url", vkUrl);
      formData.append("telegram_url", telegramUrl);
      formData.append("youtube_url", youtubeUrl);

      await axios.put(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/user/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      toast.success("User updated!", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      console.log(err);
      toast.warn(
        "An error occurred while submitting the form. Please try again later.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    }
  };

  useEffect(() => {
    formDataApi();
    roleData();
  }, []);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    EditApi();
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-6">
        <div className="shadow-sm p-3 mb-5 mt-5 bg-white rounded border-0">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="slug" className="form-label">
                Slug
              </label>
              <input
                type="text"
                className="form-control"
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
            <Form.Group controlId="MainCategory" className="mb-3">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {rolesTypes.map((item: any) => (
                  <option key={item.id} value={item.role}>
                    {item.role_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="Plan" className="mb-3">
              <Form.Label>Plan</Form.Label>
              <Form.Control
                as="select"
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
              >
                {[
                  { id: 0, name: "Bronze", value: 0 },
                  { id: 1, name: "Silver", value: 1 },
                  { id: 2, name: "Gold", value: 2 },
                  { id: 3, name: "Platinum", value: 3 },
                ].map((item) => (
                  <option key={item.id} value={item.value}>
                    {item.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="PlanDuration" className="mb-3">
              <Form.Label>Plan Duration</Form.Label>
              <div>
                <Form.Check
                  type="radio"
                  id="monthly"
                  label="Monthly"
                  value="monthly"
                  checked={planDuration === "monthly"}
                  onChange={(e) => setPlanDuration(e.target.value)}
                />
                <Form.Check
                  type="radio"
                  id="annual"
                  label="Annual"
                  value="annual"
                  checked={planDuration === "annual"}
                  onChange={(e) => setPlanDuration(e.target.value)}
                />
              </div>
            </Form.Group>
            <div className="mb-3">
              <label htmlFor="aboutMe" className="form-label">
                About Me
              </label>
              <textarea
                className="form-control"
                id="aboutMe"
                value={aboutMe}
                onChange={(e) => setAboutMe(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="facebookUrl" className="form-label">
                Facebook URL
              </label>
              <input
                type="url"
                className="form-control"
                id="facebookUrl"
                value={facebookUrl}
                onChange={(e) => setFacebookUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="twitterUrl" className="form-label">
                Twitter URL
              </label>
              <input
                type="url"
                className="form-control"
                id="twitterUrl"
                value={twitterUrl}
                onChange={(e) => setTwitterUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="instagramUrl" className="form-label">
                Instagram URL
              </label>
              <input
                type="url"
                className="form-control"
                id="instagramUrl"
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="pinterestUrl" className="form-label">
                Pinterest URL
              </label>
              <input
                type="url"
                className="form-control"
                id="pinterestUrl"
                value={pinterestUrl}
                onChange={(e) => setPinterestUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="linkedinUrl" className="form-label">
                LinkedIn URL
              </label>
              <input
                type="url"
                className="form-control"
                id="linkedinUrl"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="vkUrl" className="form-label">
                VK URL
              </label>
              <input
                type="url"
                className="form-control"
                id="vkUrl"
                value={vkUrl}
                onChange={(e) => setVkUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="telegramUrl" className="form-label">
                Telegram URL
              </label>
              <input
                type="url"
                className="form-control"
                id="telegramUrl"
                value={telegramUrl}
                onChange={(e) => setTelegramUrl(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="youtubeUrl" className="form-label">
                YouTube URL
              </label>
              <input
                type="url"
                className="form-control"
                id="youtubeUrl"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
