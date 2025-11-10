import { Container, Row, Col } from 'react-bootstrap'
import { semuaKelas } from '../data/index'
import FaqComponents from '../components/FaqComponents'
const Kelas = () => {
  return (
  <div className="kelas-page animate__animated animate__fadeInUp">
      <div className='kelas min-vh-100'>
        <Container>
          <Row>
            <Col>
              <h1 className='fw-bold text-center'>Semua Kelas</h1>
              <p className='text-center'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente, vitae?</p>
            </Col>
          </Row>
          <Row className='row-cols-lg-3 row-cols-md-2 row-cols-1 g-4'>
            {semuaKelas.map((kelas) => {
              return (
                <Col key={kelas.id}>
                  <div className='kelas-card'>
                    <img src={kelas.image} alt="unsplash.com" className='mb-4' />
                    <div className='star mb-2 px-3'>
                      <i className={kelas.star1}></i>
                      <i className={kelas.star2}></i>
                      <i className={kelas.star3}></i>
                      <i className={kelas.star4}></i>
                      <i className={kelas.star5}></i>
                    </div>
                    <h5 className='mb-3 px-3'>{kelas.title}</h5>
                    <div className='ket d-flex justify-content-between align-items-center px-3 pb-3'>
                      <p className='m-0 text-primary fw-bold'>{kelas.price}</p>
                      <button className='btn btn-danger rounded-1'>{kelas.buy}</button>
                    </div>
                  </div>
                </Col>
              )
            })}
          </Row>
        </Container>
      </div>
      <FaqComponents />
    </div>

  )
}

export default Kelas
