import {Container, Row, Col, Accordion} from 'react-bootstrap';
import {faq} from '../data/index.js';

const FaqComponents = () => {
  return (
    <div>
      <Accordion className='faq'>
        <Container>
          <Row>
            <Col>
              <h2 className='text-center fw-bold'>Pertanyaan yang Sering ditanyakan</h2>
            </Col>
          </Row>
          <Row className='row-cols-lg-2 row-cols-1 g-4 pt-5'>
            {faq.map((data)=>{
              return(
                 <Col key={data.id}>
                  <Accordion.Item eventKey={data.id}>
                    <Accordion.Header>{data.title}</Accordion.Header>
                    <Accordion.Body>
                      {data.desc}
                    </Accordion.Body>
                  </Accordion.Item>
                </Col>
              )
            })}
          </Row>
        </Container>
      </Accordion>
    </div>
  )
}

export default FaqComponents
