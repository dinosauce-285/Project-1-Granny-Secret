import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import ButtonPrimary from "../../components/ui/ButtonPrimary";
import Logo from "../../components/ui/Logo";
import Tag from "../../components/ui/Tag";
import ShowPic1 from "../../assets/showPic1.webp";
import ShowPic2 from "../../assets/showPic2.webp";
import ShowPic3 from "../../assets/showPic3.webp";
import ShowPic4 from "../../assets/showPic4.webp";

function LandingPage() {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <div className="min-h-screen px-4 sm:px-8 md:px-12 lg:px-20 bg-page">
      <div className="header h-[10vh] sm:h-[12vh] md:h-[14vh]  flex flex-row justify-between">
        <Logo className="w-24 sm:w-28 md:w-32">
          <div
            className="font-poppins font-semibold ml-5"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.5)" }}
          >
            <div>Granny's</div>
            <div>Secret</div>
          </div>
        </Logo>
        <div className="accountButton flex flex-row justify-center items-center space-x-4">
          <Link to="/signin">
            <ButtonPrimary className="w-20 sm:w-24 md:w-28 px-3 py-2 text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg border border-black hover:bg-black hover:text-white">
              Login
            </ButtonPrimary>
          </Link>
          <Link to="/signup">
            <ButtonPrimary className="w-20 sm:w-24 md:w-28 px-3 py-2 text-sm sm:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg border border-black hover:bg-black hover:text-white">
              Sign up
            </ButtonPrimary>
          </Link>
        </div>
      </div>
      <div className="wrapper mt-2 md:mt-5">
        <div
          data-aos="fade-up"
          className="banner min-h-[60vh] md:min-h-[calc(100vh-10vh)] flex flex-col-reverse md:flex-row items-center pb-10 md:pb-0"
        >
          <div className="text flex flex-col w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0">
            <div
              style={{ filter: "drop-shadow(5px 5px 5px rgba(0,0,0,0.5))" }}
              className="transition-all duration-300 hover:scale-105 boldText flex text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] font-bold font-poppins leading-tight md:justify-start"
            >
              Every meal tells
            </div>
            <div
              style={{ filter: "drop-shadow(5px 5px 5px rgba(0,0,0,0.5))" }}
              className="transition-all duration-300 hover:scale-105 boldText text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] font-bold font-poppins flex flex-row flex-wrap items-center md:justify-start group"
            >
              a memory
              <img
                style={{ filter: "drop-shadow(5px 5px 10px rgba(0,0,0,0.5))" }}
                className="h-12 sm:h-16 md:h-28 lg:h-[180px] ml-2 mt-2 md:mt-0 sm:ml-4 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110"
                src="./smallPic.webp"
                alt=""
              />
            </div>
            <p className="smallText w-full mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-justify font-inter leading-relaxed text-justify transition-all duration-300 hover:scale-[1.02] cursor-pointer">
              Cooking is more than just preparing food — it is a way of keeping
              memories alive. Every recipe carries a story, whether it is a dish
              passed down through generations or something new you discovered
              yesterday. With our platform, you can safely store, organize, and
              revisit all your favorite recipes anytime. No matter where you
              are, your kitchen memories will always be within reach, ready to
              inspire your next meal. This space is designed to celebrate
              tradition, creativity, and the joy of sharing food with the people
              you love.
            </p>
          </div>
          <div className="bannerImg w-full md:w-1/2 flex items-center justify-center">
            <img
              style={{ filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.5))" }}
              className="w-5/6 transition-transform duration-500 hover:scale-105 hover:rotate-2"
              src="./LandingPagePic1.png"
              alt=""
            />
          </div>
        </div>
      </div>
      <div
        data-aos="fade-right"
        data-aos-easing="ease-out"
        className="detailShow min-h-[auto] md:min-h-[50vh] flex flex-wrap justify-center sm:justify-between gap-x-4 gap-y-8 mt-16 md:mt-28 mb-16 group"
      >
        <Tag
          url={ShowPic1}
          children="Homemade Taste, Crafted with Love"
          className="w-full sm:w-[calc(50%-2.5rem)] lg:w-[calc(25%-3rem)]"
          description="Freshly made dishes that warm the heart and please the soul."
        />
        <Tag
          url={ShowPic2}
          children="Preserve Your Culinary Memories"
          className="w-full sm:w-[calc(50%-2.5rem)] lg:w-[calc(25%-3rem)]"
          description="Simple ingredients, beautifully prepared for your daily joy."
        />
        <Tag
          url={ShowPic3}
          children="Simple Tools for Every Cook"
          className="w-full sm:w-[calc(50%-2.5rem)] lg:w-[calc(25%-3rem)]"
          description="Inspired by home cooking, perfected with a modern touch."
        />
        <Tag
          url={ShowPic4}
          children="From Generations to Your Kitchen"
          className="w-full sm:w-[calc(50%-2.5rem)] lg:w-[calc(25%-3rem)]"
          description="Created with care, turning simple meals into memories."
        />
      </div>
      <div
        data-aos="fade-up"
        className="sampleReview min-h-auto md:min-h-[80vh] flex flex-col md:flex-row items-center pt-10 md:pt-20 pb-10 md:pb-0"
      >
        <div className="bannerImg w-full md:w-1/2 flex items-center justify-center mb-8 md:mb-0 ">
          <img
            style={{ filter: "drop-shadow(10px 10px 20px rgba(0,0,0,0.5))" }}
            className="w-5/6 transition-transform duration-500 hover:scale-105 hover:-rotate-2"
            src="./LandingPagePic2.png"
            alt=""
          />
        </div>
        <div className="text flex flex-col w-full md:w-1/2 text-center md:text-left">
          <div
            className="boldText w-full text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] font-bold  font-poppins leading-tight flex md:justify-start 
                    transition-all duration-300 hover:scale-105"
          >
            Create your
          </div>
          <div
            className="boldText w-full text-4xl sm:text-5xl md:text-6xl lg:text-[4.8rem] font-bold font-poppins flex md:justify-start
                    transition-all duration-300 hover:scale-105"
          >
            own recipe
          </div>
          <p className="smallText w-full mt-4 text-sm sm:text-base md:text-lg lg:text-xl text-justify font-inter leading-relaxed transition-all duration-300 hover:scale-[1.02] cursor-pointer">
            Cooking is more than just preparing food — it is a way of keeping
            memories alive. Every recipe carries a story, whether it is a dish
            passed down through generations or something new you discovered
            yesterday. With our platform, you can safely store, organize, and
            revisit all your favorite recipes anytime. No matter where you are,
            your kitchen memories will always be within reach, ready to inspire
            your next meal. This space is designed to celebrate tradition,
            creativity, and the joy of sharing food with the people you love.
          </p>
        </div>
      </div>
      <div className="footer mt-16 md:mt-20 border-t-[1px] border-t-text-muted h-[auto] py-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left">
        <div className="flex flex-row space-x-4 mb-4 sm:mb-0">
          <div className="font-poppins text-text-muted  text-sm sm:text-base cursor-pointer transition-colors duration-300 hover:text-gray-600 hover:underline">
            About
          </div>
          <div className="font-poppins text-text-muted  text-sm sm:text-base cursor-pointer transition-colors duration-300 hover:text-gray-600 hover:underline">
            Term
          </div>
        </div>
        <div className="font-poppins text-text-muted transition-colors duration-300 hover:text-gray-600">
          Granny's Secret ©
        </div>
      </div>
    </div>
  );
}
export default LandingPage;
