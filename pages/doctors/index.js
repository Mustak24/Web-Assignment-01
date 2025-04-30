import OutlineButton from "@/Components/Buttons/OutlineButtons";
import Selector from "@/Components/Selector";
import UnderlineText from "@/Components/Text/UnderlineText";
import { useEffect, useRef, useState } from "react";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { MdKeyboardArrowRight } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { useRouter } from "next/router";
import { CiFilter } from "react-icons/ci";
import NormalButton from "@/Components/Buttons/NormalButton";

export default function Home() {
  const router = useRouter();

  const fetchDataTimeout = useRef(null);
  const doctorCardBox = useRef(null);
  const orederOpe = useRef({});

  const [data, setData] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [page, setPage] = useState(0);

  const [isAsideFilterOpen, setAsideFilterOpen] = useState(false);


  async function onChangeFilters({consultMode, maxFee, maxExpe, facility, languages}) {
    if(fetchDataTimeout.current) clearTimeout(fetchDataTimeout.current);

    fetchDataTimeout.current = setTimeout(() => {
      let query = `consult-mode=${consultMode}&max-experience=${maxExpe == 1 ? 'min' : maxExpe}&max-fee=${maxFee >= 2000 ? 'max' : maxFee}&facility=${facility}&languages=${languages.join('-')}`;
      router.replace({
        pathname: '/doctors',
        query: {filter: query}
      })
    }, 500)
  }

  async function fetchData(filter='') {
    let res = await fetch(`/api/get-doctors?${filter}&page=${page}`);
    res = await res.json();
    if(res.error) return;

    let {doctors, totalResults} = res;

    let {by, order} = orederOpe.current;
    if(by) doctors.sort((a, b) => order == 'ase' ? (a[by] - b[by]) : (b[by] - a[by]));

    setTotalResults(totalResults)
    setData(doctors);
  }

  function handleOrder(order) {
    
    if(order.toLowerCase() == 'random') {
      orederOpe.current = {by: null, order: 'random'}
      setData(data => {
        let newData = [...data];
        for(let i=0; i<newData.length/2; i++) {
          let r1 = Math.floor(Math.random() * newData.length);
          let r2 = Math.floor(Math.random() * newData.length);
          let temp = newData[r1];
          newData[r1] = newData[r2];
          newData[r2] = temp;
        }
        return newData;
      })
      return;
    }

    let by = order.split(' ')[0] == 'Fee' ? 'fee' : 'experience';
    orederOpe.current = {by, 'order': order.includes('Low to') ? 'ase' : 'des'}
    setData(data => {
      let newData = [...data]
      if(order.includes('Low to')) {
        newData.sort((a, b) => a[by] - b[by]);
      } else {
        newData.sort((a, b) => b[by] - a[by]);
      }
      return newData;
    });
  }

  useEffect(() => {
    setPage(0);
  }, [router])

  useEffect(() => {
    fetchData(router.query?.filter);
    doctorCardBox.current.scrollTop = 0;
    window.scrollY = 0;
  }, [page, router])

  return (
    <>
      <div className="w-screen h-screen max-lg:pt-[60px] pt-[110px] flex overflow-hidden">
        
        <AsideFilterBar onChangeFilters={onChangeFilters} className="max-lg:hidden"/>

        <AsideFilterBar 
          className="lg:hidden absolute z-[10] transition-all duration-500" 
          style={{transform: isAsideFilterOpen ? 'translate(0%)' : 'translate(-100%)'}} 
          onChangeFilters={onChangeFilters} 
          onClickClose={() => setAsideFilterOpen(false)}
        />

        
        <div ref={doctorCardBox} className="w-full h-full p-8 max-sm:px-4 overflow-y-scroll overflow-x-hidden">
          <div className="flex items-center text-xs font-semibold w-full text-nowrap">
            <div>Home</div> <MdKeyboardArrowRight className="size-5" />
            <div>Doctor</div> <MdKeyboardArrowRight className="size-5" />
            <div>General Physicians</div>
          </div>

          <div className="my-5 flex max-sm:flex-col-reverse gap-3">
            <div>
              <div className="font-semibold text-2xl max-w-[600px]">
                Consult General Physicians Online - Internal Medicine Specialists
              </div>
              <div>{`( ${totalResults} Doctors )`}</div>
            </div>

            <div className="flex gap-2 flex-1 flex-wrap">
              <button onClick={() => setAsideFilterOpen(pre => !pre)} className="text-sm border-2 flex items-center justify-center h-10 pl-3 pr-4 rounded-lg cursor-pointer shrink-0 text-nowrap hover:bg-black hover:text-white transition-all gap-2 font-semibold lg:hidden active:scale-95">
                <CiFilter className="stroke-2 size-4" />
                <div className="opacity-95">Filter</div>
              </button>

              <Selector 
                opations={['Random', 'Fee Low to High', 'Fee High to Low', 'Expe Low to High', 'Expe High to Low']} 
                className="text-sm border-2 flex items-center justify-center h-10 px-5 rounded-lg cursor-pointer shrink-0 text-nowrap flex-1"
                children={<LiaExchangeAltSolid className="rotate-90"/>}
                selectorBoxClassName="border-2 my-2 py-2 rounded-lg flex flex-col gap-1 bg-white"
                selectorRowClassName="hover:bg-[rgb(25,25,25,0.1)] cursor-pointer px-2 py-1"
                onChangeValue={handleOrder}
              />
            </div>
          </div>

          <div className="flex flex-col gap-5 my-6 items-center">
            {data.map(({name, state, hospital, specialization, experience, fee, languages, facility, consultMode}) => (
              <DoctorCard  
                name={name} state={state}
                hospital={hospital} specialization={specialization}
                experience={experience} fee={fee}
                facility={facility}
                consultMode={consultMode}
              />
            ))}
          </div>

          <div className="flex items-center justify-center gap-5 w-full">
            <NormalButton 
              className={page == 0 ? 'opacity-50' : 'opacity-100'}
              disable={page==0} 
              onClick={() => setPage(pre => pre - 1)} 
            >Prev</NormalButton>

            <NormalButton 
              className={totalResults <= (page + 1)*10 ? 'opacity-50' : 'opacity-100'}
              disable={totalResults <= (page + 1)*10}
              onClick={() => setPage(pre => pre + 1)}
            >Next</NormalButton>
          </div>
        </div>
      </div>
      <GeneralMedicineInfo/>
    </>
  );
}



function AsideFilterBar({onChangeFilters=()=>{}, className='', style={}, onClickClose=()=>{}}) {

  const [consultMode, setConsultMode] = useState('both');
  const [maxExpe, setMaxExpe] = useState(1);
  const [maxFee, setMaxFee] = useState(2000);
  const [languages, setLanguages] = useState([]);
  const [facility, setFacility] = useState('both');

  const [isLangDetailsOpen, setLangDetailsOpen] = useState(false)

  useEffect(() => {
    onChangeFilters({consultMode, maxFee, maxExpe, facility, languages});
  }, [consultMode, maxExpe, maxFee, facility, languages])


  return (
    <div style={style} className={"w-[280px] h-full p-5 flex flex-col items-center gap-5 overflow-y-scroll shrink-0 bg-white " + className}>
      <div className="flex items-center justify-between w-full">
        <div className="font-semibold">Fillter</div>

        <button onClick={onClickClose} className="lg:hidden cursor-pointer active:scale-95">
          <IoIosCloseCircleOutline className="size-6 stroke-5 hover:bg-black hover:text-white transition-all rounded-full" />
        </button>
      </div>

      {
        languages.length == 0 ? null : (
          <div className="flex flex-wrap items-start w-full gap-2">
          {
            languages.map(language => (
              <div onClick={() => setLanguages(lang => lang.filter(lan => lan != language))} className="h-8 px-5 rounded-full border-2 flex items-center justify-center gap-1 font-semibold text-xs hover:text-white hover:bg-black transition-all relative">
                {language}
                <IoIosCloseCircleOutline className="size-5 stroke-5" />
                <div className="absolute top-0 translate-y-[-50%] left-2 bg-black text-white rounded-full px-2 text-[10px] font-light py-[1px]">lang</div>
              </div>
            ))
          }
          </div>
        )
      }

      <hr className="w-full" />

      <OutlineButton style={{minHeight: '34px'}}>
        <div className="text-xs font-semibold">
          Show Doctors Near Me
        </div>
      </OutlineButton>

      <div className="w-full flex flex-col gap-2">
        <div className="font-semibold">Mode of Consult</div>

        <label htmlFor="consult-offline" className="text-sm font-medium flex items-center gap-2">
          <input 
            checked={consultMode == 'offline' || consultMode == 'both'} 
            type="checkbox" id="consult-offline"  
            onChange={(e) => {
              let {checked} = e.target
              if(consultMode == 'both') return setConsultMode(checked ? 'both' : 'online');
              if(consultMode == 'online') return setConsultMode(checked ? 'both' : 'offline');
              setConsultMode(checked ? 'offline' : 'online');
            }} 
          />
          Hospital Visitx
        </label>

        <label htmlFor="consult-online" className="text-sm font-medium flex items-center gap-2">
          <input 
            checked={consultMode == 'online' || consultMode == 'both'} 
            type="checkbox" id="consult-online" 
            onChange={(e) => {
              let {checked} = e.target
              if(consultMode == 'both') return setConsultMode(checked ? 'both' : 'offline');
              if(consultMode == 'offline') return setConsultMode(checked ? 'both' : 'online');
              setConsultMode(checked ? 'online' : 'offline');
            }} 
          />
          Online Visitx
        </label>
      </div>
      
      <div className="w-full flex flex-col gap-2">
        <div className="font-semibold">{'Min Experience (In Years)'}</div>

        <div className="flex flex-col max-w-[150px]">
          <div className="text-xs">{maxExpe}{maxExpe == 16 ? '+' : ''} years </div>
          <input type="range" min={1} max={16} step={3} value={maxExpe} onChange={e => setMaxExpe(e.target.value)} />
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="font-semibold">{'Fees (In Rupees)'}</div>
        
        <div className="flex flex-col max-w-[150px]">
          <div className="text-xs">{maxFee}{maxFee == 2000 ? '+' : ''} Rupees </div>
          <input value={maxFee} type="range" min={500} max={2000} step={500} onChange={e => setMaxFee(e.target.value)} />
        </div>
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="font-semibold">language</div>

        <label htmlFor="lang-english" className="text-sm font-medium flex items-center gap-2">
          <input 
            type="checkbox" id="lang-english" 
            checked={languages.includes('english')} 
            onChange={(e) =>{ 
              setLanguages(lang => e.target.checked ? [...lang, 'english'] : lang.filter(lan => lan != 'english'));
            }}  
          />
          English
        </label>

        <label htmlFor="lang-hindi" className="text-sm font-medium flex items-center gap-2">
          <input 
            type="checkbox" id="lang-hindi" 
            checked={languages.includes('hindi')} 
            onChange={(e) =>{ 
              setLanguages(lang => e.target.checked ? [...lang, 'hindi'] : lang.filter(lan => lan != 'hindi'));
            }}    
          />
          Hindi
        </label>

        <div className="flex flex-col items-start gap-2">
          <div className="flex flex-col gap-2" style={{display: isLangDetailsOpen ? 'flex' : 'none'}}>
            {['Telugu', 'Punjabi', 'Bengali', 'Marathi', 'Urdu', 'Gujrati', 'Tamil', 'Kannada', 'Oriyal', 'Persian', 'Assamese'].map(language => (
              <label htmlFor={`lang-${language}`} className="text-sm font-medium flex items-center gap-2">
                <input 
                  type="checkbox" id={`lang-${language}`} 
                  checked={languages.includes(language)} 
                  onChange={(e) =>{ 
                    setLanguages(lang => e.target.checked ? [...lang, language] : lang.filter(lan => lan != language));
                  }}  
                />
                {language}
              </label>
            ))}
          </div>

          <button onClick={() => setLangDetailsOpen((pre) => !pre)} className="text-blue-500 font-semibold text-sm">
            {isLangDetailsOpen ? 'See Less' : '10+ More'}
          </button>
        </div> 
      </div>

      <div className="w-full flex flex-col gap-2">
        <div className="font-semibold">Facility</div>

        <label htmlFor="facility-apollo" className="text-sm font-medium flex items-center gap-2">
          <input 
            checked={facility == 'apollo' || facility == 'both'} 
            type="checkbox" id="facility-apollo" 
            onChange={(e) => {
              let {checked} = e.target
              if(facility == 'both') return setFacility(checked ? 'both' : 'other');
              if(facility == 'other') return setFacility(checked ? 'both' : 'apollo');
              setFacility(checked ? 'apollo' : 'other');
            }} 
          />
          Apollo Hospital
        </label>

        <label htmlFor="facility-other" className="text-sm font-medium flex items-center gap-2">
          <input 
            checked={facility == 'other' || facility == 'both'} 
            type="checkbox" id="facility-other" 
            onChange={(e) => {
              let {checked} = e.target
              if(facility == 'both') return setFacility(checked ? 'both' : 'apollo');
              if(facility == 'apollo') return setFacility(checked ? 'both' : 'apollo');
              setFacility(checked ? 'other' : 'apollo');
            }} 
          />
          Other Clinics
        </label>
      </div>


      <div className="min-h-40"></div>
    </div>
  )
}




function DoctorCard({name, state, hospital, specialization, experience, fee, consultMode}) {
  return (
    <div className="w-full max-w-[820px] flex flex-wrap p-4 justify-between gap-5 rounded-lg shadow-[0_0_2px_1px_rgb(0,0,0,0.2)]">
      <div className="flex gap-2 flex-1 flex-wrap">
        <div className="size-[50px] aspect-square relative">
         <FaUser className="opacity-75 w-full h-full" />
        </div>
 
        <div className="flex flex-col overflow-hidden w-full flex-1 min-w-[200px]">
          <div className="font-semibold">{name}</div>
          <div className="text-xs font-semibold opacity-70">
            <div>{specialization}</div>
            <div className="text-purple-700">{experience} Years</div>
            <div>{state}</div>
            <div>{hospital}</div>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col self-end items-center gap-2 flex-1">
        <div className="font-bold">₹{fee}</div>
        <div className="flex gap-5 items-center w-full">
          {
            consultMode.map(mode => (
              mode.toLowerCase() == 'online' ? (
                  <button className=" flex-1 border-2 text-sm font-semibold rounded-lg min-h-10 px-5 hover:text-white hover:bg-black transition-all border-black max-sm:text-xs">Consult Online</button>
                ) : (
                  <button className="flex-1 bg-black text-sm text-white min-h-10 px-5 rounded-lg hover:bg-white hover:text-black border-black border-2 transition-all max-sm:text-xs">Visit Doctor</button>
              )
            ))
          }
        </div>
      </div>
    </div>
  )
}


function GeneralMedicineInfo()  {
  return (
    <div className="p-6 space-y-8 text-sm">
      <section>
        <h1 className="text-xl font-bold">Book Consult for General Medicine Online</h1>
        <p className="opacity-75">Booking an appointment with a top general physician (GP) is now easier than ever with Apollo 24|7. Our maxExperienced doctors provide comprehensive care for a wide range of medical conditions, including fever, allergies, and diabetes. You can conveniently schedule an online general physician consultation or visit a trusted hospital/clinic near you. Our allergies doctor and diabetes doctor offer flexible appointment slots to suit your needs. With transparent general physician maxFees and genuine general physician reviews, you can make an informed decision when choosing your healthcare provider.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">What is General Medicine?</h2>
        <p className="opacity-75">General medicine is a medical speciality focusing on the prevention, diagnosis, and treatment of internal diseases in adults. It covers conditions like fever, asthma, heart disease, liver problems, hypertension, and neurological disorders. General physicians play a critical role in preventive healthcare, early diagnosis, and long-term management of chronic diseases, improving patient outcomes and quality of life.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Who is a General Physician?</h2>
        <p className="opacity-75">A general physician specialises in diagnosing, treating, and preventing adult diseases. They complete an MBBS degree followed by postgraduate training in General or Internal Medicine. Their responsibilities include diagnosing diverse medical conditions, preventive healthcare, and managing multiple co-morbidities.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">What Do General Physicians Do?</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Conduct thorough physical examinations and medical histories.</li>
          <li>Order and interpret diagnostic tests.</li>
          <li>Develop personalised treatment plans.</li>
          <li>Provide preventive care through vaccinations and health screenings.</li>
          <li>Educate patients on health conditions and treatment strategies.</li>
          <li>Collaborate with specialists and healthcare teams for comprehensive care.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Sub-Specialities of General Medicine</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Geriatric Medicine</li>
          <li>Palliative Care</li>
          <li>Sports Medicine</li>
          <li>Preventive Medicine</li>
          <li>Paediatric Medicine</li>
          <li>Addiction Medicine</li>
          <li>Occupational Medicine</li>
          <li>Rural Medicine</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Examinations Conducted</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Physical Examination</li>
          <li>Blood Tests</li>
          <li>Urine Analysis</li>
          <li>Imaging Studies (X-ray, CT scan, MRI)</li>
          <li>ECG</li>
          <li>Pulmonary Function Tests</li>
          <li>Biopsies</li>
          <li>Allergy Tests</li>
          <li>Glucose Tolerance Test</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Common Conditions Treated</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Fever</li>
          <li>Allergies</li>
          <li>Diabetes</li>
          <li>Hypertension</li>
          <li>Respiratory infections</li>
          <li>Gastrointestinal issues</li>
          <li>UTIs</li>
          <li>Skin conditions</li>
          <li>Musculoskeletal pain</li>
          <li>Mental health concerns</li>
          <li>Headaches</li>
          <li>Thyroid disorders</li>
          <li>Anaemia</li>
          <li>Sleep disorders</li>
          <li>Vaccinations</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Reasons to See a General Physician</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Annual check-ups</li>
          <li>Chronic disease management</li>
          <li>Acute illness treatment</li>
          <li>Addressing unexplained symptoms</li>
          <li>Preventive care and health screenings</li>
          <li>Family history risk management</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Procedures Performed by General Physicians</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Health screenings and vaccinations</li>
          <li>Wound care and skin lesion removal</li>
          <li>Abscess drainage</li>
          <li>Joint injections</li>
          <li>Nebulizer treatments</li>
          <li>Ear wax removal</li>
          <li>Pap smears</li>
          <li>ECGs and Spirometry</li>
          <li>Blood glucose testing</li>
          <li>Minor fracture management</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Why Choose an Apollo 24|7 General Physician?</h2>
        <p className="opacity-75">Apollo 24|7 doctors offer high-quality, patient-centric healthcare with advanced facilities and personalised care plans. Patients can easily book appointments online and view doctor profiles, maxFees, and reviews for informed decision-making.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">What to maxExpect During Your Visit</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Medical history review</li>
          <li>Discussion of current symptoms</li>
          <li>Comprehensive physical examination</li>
          <li>Necessary diagnostic tests</li>
          <li>Diagnosis and tailored treatment plan</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">How to Book an Appointment</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><strong>Online:</strong> Visit the Apollo 24|7 website or mobile app, search "general physician near me," and book a slot.</li>
          <li><strong>Offline:</strong> Visit the nearest Apollo Clinic or Hospital and book through the reception.</li>
        </ul>
      </section>
    </div>
  );
};