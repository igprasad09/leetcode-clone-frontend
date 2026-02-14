import styled from 'styled-components';

const FackbookTooltip = () => {
  return (
    <StyledWrapper>
      <div className="tooltip-container">
        <div className="tooltip">
          <div className="profile">
            <div className="user">
              <div className="img"><img src="/instprofile.jpg" className='rounded-sm'/></div>
              <div className="details">
                <div className="name">User</div>
                <div className="username">@prasad</div>
              </div>
            </div>
            <div className="about">100+ Friends</div>
          </div>
        </div>
        <div className="text">
          <a className="icon" href="https://www.facebook.com/share/1Hau7mUX5i/">
            <div className="layer">
              <span />
              <span />
              <span />
              <span />
              <span className="facebookSVG">
                <svg viewBox="0 0 40 40" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg">
                  <linearGradient gradientUnits="userSpaceOnUse" gradientTransform="matrix(40 0 0 -39.7778 11115.001 16212.334)" y2="407.5726" y1="406.6018" x2="-277.375" x1="-277.375" id="a">
                    <stop stopColor="#0062e0" offset={0} />
                    <stop stopColor="#19afff" offset={1} />
                  </linearGradient>
                  <path d="M16.7 39.8C7.2 38.1 0 29.9 0 20 0 9 9 0 20 0s20 9 20 20c0 9.9-7.2 18.1-16.7 19.8l-1.1-.9h-4.4l-1.1.9z" fill="url(#a)" />
                  <path d="m27.8 25.6.9-5.6h-5.3v-3.9c0-1.6.6-2.8 3-2.8H29V8.2c-1.4-.2-3-.4-4.4-.4-4.6 0-7.8 2.8-7.8 7.8V20h-5v5.6h5v14.1c1.1.2 2.2.3 3.3.3 1.1 0 2.2-.1 3.3-.3V25.6h4.4z" fill="#fff" />
                </svg>
              </span>
            </div>
            <div className="text">Facebook</div>
          </a>
        </div>
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .tooltip-container {
    position: relative;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 17px;
    border-radius: 10px;
  }

  .tooltip {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.3s;
    border-radius: 15px;
    box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2),
      inset -5px -5px 15px rgba(255, 255, 255, 0.1),
      5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.1);
  }

  .profile {
    background: #3b5998;
    border-radius: 10px 15px;
    padding: 10px;
    border: 1px solid #29487d;
  }

  .tooltip-container:hover .tooltip {
    top: -150px;
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .icon {
    text-decoration: none;
    color: #fff;
    display: block;
    position: relative;
  }
  .icon .layer {
    width: 55px;
    height: 55px;
    border: 3px solid #1877f2;
    border-radius: 50%;
    transition: transform 0.3s, border 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 0 15px rgba(24, 119, 242, 0.7), 0 0 20px rgba(24, 119, 242, 0.5);
  }

  .icon:hover .layer {
    transform: rotate(-35deg) skew(20deg);
    box-shadow: 0 0 30px rgba(24, 119, 242, 1), 0 0 40px rgba(24, 119, 242, 0.7);
  }

  .layer span {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border: 1px solid #fff;
    border-radius: 50%;
    transition: all 0.3s;
  }

  .layer span,
  .text {
    color: #1877f2;
    border-color: #1877f2;
  }

  .icon:hover .layer span {
    box-shadow: -1px 1px 3px #1877f2;
  }

  .icon .text {
    position: absolute;
    left: 50%;
    bottom: -5px;
    opacity: 0;
    font-weight: 500;
    transform: translateX(-50%);
    transition: bottom 0.3s ease, opacity 0.3s ease;
  }

  .icon:hover .text {
    bottom: -35px;
    opacity: 1;
  }

  .icon:hover .layer span:nth-child(1) {
    opacity: 0.2;
  }

  .icon:hover .layer span:nth-child(2) {
    opacity: 0.4;
    transform: translate(5px, -5px);
  }

  .icon:hover .layer span:nth-child(3) {
    opacity: 0.6;
    transform: translate(10px, -10px);
  }

  .icon:hover .layer span:nth-child(4) {
    opacity: 0.8;
    transform: translate(15px, -15px);
  }

  .icon:hover .layer span:nth-child(5) {
    opacity: 1;
    transform: translate(20px, -20px);
  }

  .facebookSVG {
    font-size: 25px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #1877f2;
    border-radius: 50%;
    background: linear-gradient(
      45deg,
      #1877f2 0%,
      #3b5998 25%,
      #1877f2 50%,
      #3b5998 75%,
      #1877f2 100%
    );
  }

  .user {
    display: flex;
    gap: 10px;
  }

  .img {
    width: 50px;
    height: 50px;
    font-size: 25px;
    font-weight: 700;
    border: 1px solid #1877f2;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
  }

  .name {
    font-size: 17px;
    font-weight: 700;
    color: #1877f2;
  }

  .details {
    display: flex;
    flex-direction: column;
    gap: 0;
    color: #fff;
  }

  .about {
    color: #ccc;
    padding-top: 5px;
  }`;

export default FackbookTooltip;
