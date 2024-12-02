import background from '../../images/bg-img/breadcumb4.jpg';
import backgroundRecipe from '../../images/bg-img/about.png';
import salad from '../../images/core-img/salad.png';
import burger from '../../images/core-img/hamburger.png';
import cake from '../../images/core-img/pancake.png';

const About = () => {
  return (
    <>
      <div className="container mx-auto ">
        <div
          style={{ backgroundImage: `url(${background})` }}
          className="bg-cover h-44 container mx-auto  items-center my-10 text-white flex justify-center text-3xl font-semibold md:opacity-60 lg:opacity-60"
        >
          <p>About Us</p>
        </div>
        <div className="lg:mx-30">
          <div>
            <p className="text-3xl font-medium flex justify-center py-15">
              Who we are and what we do?
            </p>
            <p className="text-black font-medium">
              Donec quis metus ac arcu luctus accumsan. Nunc in justo tincidunt,
              sodales nunc id, finibus nibh. Class aptent taciti sociosqu ad
              litora torquent per conubia nostra, per inceptos himenaeos. Fusce
              nec ante vitae lacus aliquet vulputate. Donec scelerisque accumsan
              molestie. Vestibulum ante ipsum primis in faucibus orci luctus et
              ultrices posuere cubilia Curae
            </p>
            <p className="text-[#9b9b9b] py-15">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Vestibulum nec varius dui. Suspendisse potenti. Vestibulum ac
              pellentesque tortor. Aenean congue sed metus in iaculis. Cras a
              tortor enim. Phasellus posuere vestibulum ipsum, eget lobortis
              purus. Orci varius natoque penatibus et magnis dis parturient
              montes, nascetur ridiculus mus. Proin malesuada et mauris ut
              lobortis. Sed eu iaculis sapien, eget luctus quam. Aenean
              hendrerit varius massa quis laoreet. Donec quis metus ac arcu
              luctus accumsan. Nunc in justo tincidunt, sodales nunc id, finibus
              nibh. Class aptent taciti sociosqu ad litora torquent per conubia
              nostra, per inceptos himenaeos.
            </p>
            <div className="flex justify-between  pb-20 pt-10">
              <div className="space-y-2">
                <img src={salad} />
                <p>1287</p>
                <p>Amazing receipies</p>
              </div>
              <div className="space-y-2">
                <img src={burger} />
                <p>25</p>
                <p>Burger receipies</p>
              </div>
              <div className="space-y-2 mt-2">
                <img src={cake} />
                <p>326</p>
                <p>Desert receipies</p>
              </div>
            </div>
            <div>
              <img src={backgroundRecipe} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
