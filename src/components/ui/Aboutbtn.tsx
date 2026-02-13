import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Aboutbtn = () => {
  const navigate = useNavigate();
  return (
    <StyledWrapper>
      <button className="Btn" onClick={()=>navigate("/contact")}>
      About us</button>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .Btn {
    width: 120px;
    height: 33px;
    border: none;
    margin-right: 12px;
    border-radius: 10px;
    background: linear-gradient(to right,#77530a,#ffd277,#77530a,#77530a,#ffd277,#77530a);
    background-size: 250%;
    background-position: left;
    color: #ffd277;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition-duration: 1s;
    overflow: hidden;
  }

  .Btn::before {
    position: absolute;
    content: "Developers";
    color: #ffd277;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 97%;
    height: 90%;
    border-radius: 8px;
    transition-duration: 1s;
    background-color: rgba(0, 0, 0, 0.842);
    background-size: 200%;
  }

  .Btn:hover {
    background-position: right;
    transition-duration: 1s;
  }

  .Btn:hover::before {
    background-position: right;
    transition-duration: 1s;
  }

  .Btn:active {
    transform: scale(0.95);
  }`;

export default Aboutbtn;
