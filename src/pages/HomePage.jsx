import { Container, Row, Col } from 'react-bootstrap'
import HeroImage from '../assets/img/hero.png'
import { kelasTerbaru, dataSwiper } from '../data/index'
import { useNavigate } from 'react-router-dom'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import FaqComponents from '../components/FaqComponents'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

const HomePage = () => {
  const navigate = useNavigate()

  return (
  <div className="homepages animate__animated animate__fadeInUp">
      <header className="w-100 min-vh-100 d-flex align-items-center">
        <Container>
          <Row className='header-box d-flex align-items-center pt-lg-5'>
            <Col lg='6'>
              <h1 className='mb-4 animate__animated animate__fadeInUp' style={{ animationDelay: '0.2s' }}>Temuka <br /> <span>Bakat Kreatif-mu</span> <br /> Bersama Kami!</h1>
              <p className='mb-4 animate__animated animate__fadeInUp' style={{ animationDelay: '0.4s' }}>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Cumque est rem similique. Placeat, praesentium omnis?</p>
              <button className='btn btn-danger btn-lg rounded-1 me-2 mb-xs-0 mb-2 animate__animated animate__fadeInUp' style={{ animationDelay: '0.6s' }} onClick={() => navigate("kelas")}>Lihat Kelas</button>
              <button className='btn btn-outline-danger btn-lg rounded-1 animate__animated animate__fadeInUp' style={{ animationDelay: '0.8s' }}>Lihat Promo</button>
            </Col>
            <Col lg='6' className="position-relative">
              <img 
                src={HeroImage} 
                alt="HeroImg" 
                className='animate__animated animate__fadeInUp'
                style={{ animationDelay: '0.6s' }}
              />
            </Col>
          </Row>
        </Container>
      </header>
      <div className="kelas w-100 min-vh-100">
        <Container>
          <Row>
            <Col>
              <h1 className='text-center fw-bold'>Kelas Terbaru</h1>
              <p className='text-center'>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
            </Col>
          </Row>
          <Row>
            {kelasTerbaru.map((kelas) =>{
              return(
                <Col key={kelas.id} className='shadow rounded'>
                  <img src={kelas.image} alt="unsplash.com" className='w-100 mb-5 rounded' />
                  <div className='star mb-2 px-3'>
                    <i className={kelas.star1}></i>
                    <i className={kelas.star2}></i>
                    <i className={kelas.star3}></i>
                    <i className={kelas.star4}></i>
                    <i className={kelas.star5}></i>
                  </div>
                  <h5 className='mb-5 px-5'>{kelas.title}</h5>
                  <div className='ket d-flex justify-content-between align-items-center px-3 pb-3'>
                    <p className='m-0 text-primary fw-bold'>{kelas.price}</p>
                    <button className='btn btn-danger rounded-1'>{kelas.buy}</button>
                  </div>
                </Col>
              )
            })}
          </Row>
          <Row>
            <Col className='text-center'>
              <button className='btn btn-success rounded-5 btn-lg' onClick={()=>navigate("kelas")}>Lihat Semua Kelas <i className='fa-solid fa-chevron-right ms-1 '></i></button>
            </Col>
          </Row>
        </Container>
      </div>
      <div className="testimonial py-5">
        <Container>
          <Row>
            <Col>
              <h1 className="text-center fw-bold my-5">Testimonial</h1>
            </Col>
          </Row>
          <Row className="position-relative">
            <Swiper
              slidesPerView={1}
              spaceBetween={10}
              pagination={{
                clickable: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 1,
                  spaceBetween: 20,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 40,
                },
                992: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
                1200: {
                  slidesPerView: 3,
                  spaceBetween: 50,
                },
              }}
              modules={[Pagination]}
              className="mySwiper"
            >
              {dataSwiper.map((data) => (
                <SwiperSlide key={data.id} className="shadow-sm">
                  <p className="desc">{data.desc}</p>
                  <div className="people">
                    <img src={data.image} alt={data.name} />
                    <div>
                      <h5 className="mb-1">{data.name}</h5>
                      <p className="fw-bold m-0">{data.skill}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </Row>
        </Container>
      </div>
      <FaqComponents />
    </div>
  )
}

export default HomePage
