import {Container, Row, Col} from 'react-bootstrap'
import {testimonial}from '../data/index'
import FaqComponents from '../components/FaqComponents'


function TestimoniPage() {
  return (
    <div className='testimonial-page'>
      <div className='testimonial'>
        <Container>
          <Row>
            <Col>
              <h1 className='fw-bold text-center'>Semua Testimonial</h1>
              <p className='text-center'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eos, obcaecati.</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  )
}

export default TestimoniPage
