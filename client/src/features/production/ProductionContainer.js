import styled from 'styled-components'
import ProductionCard from './ProductionCard'
import { useFetchProductionsQuery } from '../../services/productionApi'
import Spinner from '../../components/Spinner'

function ProductionContainer() {
    const {data, error, isLoading} = useFetchProductionsQuery()

    if (isLoading) {
        return <Spinner loading={isLoading} />
    }

    if (error) {
        return <h1>{error}</h1>
    }

    return (
        <div>
            <Title><span>F</span>latIron Theater <span>C</span>ompany</Title>
            <CardContainer>
                {data && data.map(production => <ProductionCard  key={production.id} production={production}  />)}
            </CardContainer>
        </div>
    )
  }
  
export default ProductionContainer

const Title = styled.h1`
    text-transform: uppercase;
    font-family:Arial, sans-serif;
    width:70px;
    font-size: 70px;
    line-height: .8;
   
    transform: scale(.7, 1.4);
    
    span{
        color:#42ddf5;
    }
`


const CardContainer = styled.ul`
    display:flex;
    flex-direction:column;

`
