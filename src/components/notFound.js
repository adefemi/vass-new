import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container">
      <div className="app-content content">
        <div className="content-wrapper">
          <div className="content-body">
            <section id="number-tabs">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="notfound__container">
                    <h2>404</h2>
                    <p>
                      I think you wandered into the wilderness and you got lost.{" "}
                    </p>
                    <div className="notfound__container--btn">
                      <Link to="/">
                        <div>GO BACK HOME</div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
