import {Container, Row, Col} from 'react-bootstrap'
import {testimonial} from '../data/index'
import FaqComponents from '../components/FaqComponents'

export default function TestimoniPage() {
  return (
    <div className="page-root animate__animated animate__fadeInUp">
      <div className="testimonial-page">
        <div className="testimonial">
          <Container>
            <Row >
              <Col>
                <h1 className='fw-bold text-center'>Semua Testimonial</h1>
                <p className='text-center'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos, obcaecati.</p>
              </Col>
            </Row>
            <Row className="row-cols-lg-3 row-cols-1">
              {testimonial.map((data, idx) => {
                const delay = `${Math.min(idx, 8) * 0.08}s`;
                return (
                  <Col key={data.id} className="mb-5 animate__animated animate__fadeInUp" style={{ animationDelay: delay }}>
                    <p className="desc shadow-sm">{data.desc}</p>
                    <div className="people">
                      <img src={data.image} alt={data.name} />
                      <div>
                        <h5 className="mb-1">{data.name}</h5>
                        <p className="fw-bold m-0">{data.skill}</p>
                      </div>
                    </div>
                  </Col>
                )
              })}
            </Row>
          </Container>
        </div>
      </div>
      <FaqComponents />
    </div>
  )
}
