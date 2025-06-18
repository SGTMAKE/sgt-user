import Banner from "@/components/banner";
import Latest from "@/components/latest";
import Hero from "@/components/hero/hero";
import ProductRow from "@/components/products/product-row";
import { getHeroBanner } from "@/lib/api/get-hero-banner";
import { getFilteredProduct } from "@/lib/api/products/get-filtered-products";
import { capitalizeSearchParam } from "@/lib/utils";
import Navbar from "./components/Navbar";
import Services from "@/app/components/Services";
import IndustryComponent from "@/app/components/IndustryComponent";
import Footer from "@/app/components/Footer";
import Choose from "@/app/components/Choose";
import Serve from "@/app/components/Serve";
import CustomerReview from "@/app/components/Review";
import GlobalDelivery from "@/app/components/GlobalDelivery";




const rows = ["popular"];
function makeRowTitle(title: string) {
  if (title === "popular") return "Our Featured Products";
  else if (title === "audio-video") return "Best Selling in Audio/Video";
  else return `Best Selling in ${capitalizeSearchParam(title)}`;
}
function makeRowViewAll(row: string) {
  if (row === "popular") return "/store?popular";
  else return `/store/c/${row}?popular`;
}


export default async function page() {
  const heroBanners = await getHeroBanner();

  const productRows = await Promise.all(
    rows.map(async (row) => {
      return {
        title: makeRowTitle(row),
        products: await getFilteredProduct({
          category: row === "popular" ? undefined : row,
          sort: "popular",
        }),
        viewAll: makeRowViewAll(row),
      };
    }),
  );    

  return (
    <div className=" space-y-14">
      {heroBanners && <Hero slides={heroBanners} />}
      <Banner />
    
       <Services/>
      <IndustryComponent/>
      {productRows.map((productRow, i) => (
        <div key={i}>
          <ProductRow {...productRow} />
        </div>
      ))}
      {/* <FeatureProduct/> */}
      {/* <Latest /> */}

      <Choose/>
      <Serve/>
      <CustomerReview/>
      <GlobalDelivery/>
      {/* <ContactUs/> */}
      <Footer/>

 
    </div>
  );
}
