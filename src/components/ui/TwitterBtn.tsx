import styled from 'styled-components';

const TwitterBtn = () => {
  return (
    <StyledWrapper>
      <div>
        <button className="button">
          <a href="https://x.com/prasad151181569" className="no-link-style">
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"    x="0px" y="0px" width={30} height={30} viewBox="0 0 50 50"  className="icon icons8-Twitter-Filled">
              <path d="M49.5,10.9c-1.8,0.8-3.7,1.3-5.7,1.5c2.1-1.3,3.7-3.4,4.5-5.9c-2,1.2-4.2,2.1-6.6,2.6c-1.9-2-4.6-3.2-7.6-3.2c-5.8,0-10.5,4.7-10.5,10.5c0,0.8,0.1,1.6,0.4,2.3C11,18,6.3,15.2,3.4,11.5C2.5,13.1,2,14.9,2,16.7c0,3.6,1.8,6.8,4.6,8.6c-1.7,0-3.3-0.5-4.7-1.3v0.1c0,5,3.5,9.2,8.2,10.2c-0.9,0.2-1.8,0.3-2.7,0.3c-0.7,0-1.4,0-2-0.1c1.4,4.3,5.4,7.4,10.2,7.5c-3.7,2.9-8.3,4.6-13.3,4.6c-0.9,0-1.8,0-2.7-0.1c4.8,3.1,10.5,4.9,16.7,4.9c20,0,30.9-16.6,30.9-30.9c0-0.5,0-1.1,0-1.6C46.8,14.6,48.3,12.9,49.5,10.9z" fill="#ffffff" />
            </svg>
            <svg xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"  width={80} height={80} viewBox="0 0 50 50"  className="icon icons8-X">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#ffffff" />
            </svg>
          </a>
        </button>
        <br />
      </div>
    </StyledWrapper>
  );
}

const StyledWrapper = styled.div`
  .button {
    background-color: #1DA1F2;
    border: none;
    border-radius: 100%;
    box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.5);
    animation: sway 2s infinite alternate;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    perspective: 200px;
    transition: transform 0.5s, box-shadow 0.5s;
  }

  .button:hover {
    transform: rotate(-360deg);
    box-shadow: 0 0 20px 0 rgba(0, 0, 255, 0.5);
  }

  @keyframes grow {
    0% {
      transform: scale(1);
    }

    100% {
      transform: scale(10);
    }
  }

  @keyframes glow {
    0% {
      text-shadow: gold 1px 1px 1px;
    }

    100% {
      text-shadow: gold 0 0 10px gold;
    }
  }

  .icon {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.6));
    transition: transform 0.5s;
  }

  .icon:hover {
    transform: scale(1.5);
    filter: drop-shadow(1px 2px 4px rgba(0,0,0,0.9))
  }

  .icon.icons8-X {
    display: none;
  }

  .button:hover .icons8-Twitter-Filled {
    display: none;
  }

  .button:hover .icons8-X {
    display: block;
    position: relative;
    top: 3em;
    left: 3em;
    align: center;
  }

  .follow-text {
    color: white;
    position: relative;
    top: 2em;
    left: -2em;
    transition: transform 0.5s;
  }

  .follow-text:hover {
    transform: scale(1.2);
    color: rgba(31,81,255,100);
    filter: drop-shadow(2px 2px 4px rgba(31,81,255,2.0))
  }`;

export default TwitterBtn;
