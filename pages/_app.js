import Navbar from "@/Components/Navbar";
import "@/styles/globals.css";

export default function App({ Component, pageProps }) {
  return  <>
      <Navbar/>
      <Component {...pageProps} />
  </>
}
