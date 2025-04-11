import MainComponent from "@/components/HomeCategories/MainComponent";
import Sidebar from "@/components/Sidebar/Sidebar";
import BreakingNews from "@/components/BreakingNews/BreakingNews";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import HeaderAd from "@/components/HeaderAd/HeaderAd";
import GreenBar from "@/components/GreenBar/MagazineBar";
import HomeBanner_3 from "@/components/Homebanner/Homebanner-3/HomeBanner-3";
import HomeBanner_4 from "@/components/Homebanner/Homebanner-4/HomeBanner-4";
import MagazineAd_2 from "@/components/MagazineHomePage/MagazineAd-2";
import HomeMarket from "@/components/Home-Market/HomeMarket";
import HomeReports from "@/components/homeReports/homeReports";
import HomeBanner from "@/components/Homebanner/HomeBanner";
import HomeBanner_2 from "@/components/Homebanner/Homebanner-2/HomeBanner-2";
import LinkedinPage from "@/components/LinkedinForm/LinkedinPage";
import Services from "@/components/Servicesbar/ServiceBar";
import RefreshOnVerified from "./Verifies";
import ChatPopup from "@/components/ChatBot/MessangerContainer";
import AdHeader from "@/components/GoogleAds/AdHeader";
import styles from './page.module.css'
import MobileNavNew from "@/components/MobileNavbarNew/MobileNavNew";

const Home = async () => {
  const sliderRes = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}api/admin/post/slider`,
    { cache: "no-store" }
  );
  const slide = await sliderRes.json();

  const sliderType = slide[0].slider_type;
  return (
    <>
      {/* This component will check for "verified" query param and reload if present */}
      <RefreshOnVerified />
      <div className="container-fluid m-0 p-0">
        <BreakingNews />
        <Navbar />
        <MobileNavNew/>
        <div className="main_content__position">
          <div className="container">
            <HeaderAd />
            {sliderType == 1 ? (
              <HomeBanner />
            ) : sliderType == 2 ? (
              <HomeBanner_2 />
            ) : sliderType == 3 ? (
              <HomeBanner_3 />
            ) : sliderType == 4 ? (
              <HomeBanner_4 />
            ) : (
              <HomeBanner />
            )}
            <h1>Latest Updates on Automobiles, Agriculture & Construction</h1>
            <AdHeader />
            <MagazineAd_2 />
            <HomeMarket />
            <HomeReports />
            <div className="row mt-4">
              <div className="col-lg-8">
                <MainComponent />
              </div>
              <Sidebar />
            </div>
            <LinkedinPage />
          </div>
          <hr />
          <Services />
        </div>

          {/* <ChatPopup /> */}
          <Footer />
          {/* <GreenBar /> */}

      </div>
    </>
  );
};

export default Home;
