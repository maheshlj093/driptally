import { useState } from "react";
import Navbar from "./Navbar";
import CampaignMessages from "./CampaignMessages";
import SendCampaign from "./SendCampaign";
import SendHistory from "./SendHistory";
import StatCard from "./StatCard";

export default function Dashboard({ onLogout }) {
  const [active, setActive] = useState("dashboard");

  return (
    <>
      <Navbar onLogout={onLogout} active={active} setActive={setActive} />

      <div className="container my-4">

        {/* ===== DASHBOARD ===== */}
        {active === "dashboard" && (
          <>
            <div className="row g-4">

              {/* SEND CAMPAIGN – GREEN */}
              <div className="col-lg-4 col-md-6">
                <div
                  className="dashboard-card gradient-green"
                  onClick={() => setActive("send")}
                >
                  <StatCard
                    amount="Send"
                    title="Send Campaign"
                    updated="Start messaging"
                    icon="bi-send-fill"
                  />
                </div>
              </div>

              {/* Messages – BLUE */}
              <div className="col-lg-4 col-md-6">
                <div
                  className="dashboard-card gradient-blue"
                  onClick={() => setActive("create")}
                >
                  <StatCard
                    amount="Messages"
                    title="Campaign Messages"
                    updated="7-day automation"
                    icon="bi-megaphone-fill"
                  />
                </div>
              </div>

              {/* SEND HISTORY – ORANGE */}
              <div className="col-lg-4 col-md-12">
                <div
                  className="dashboard-card gradient-orange"
                  onClick={() => setActive("history")}
                >
                  <StatCard
                    amount="History"
                    title="Send History"
                    updated="View history"
                    icon="bi-clock-history"
                  />
                </div>
              </div>

            </div>
          </>
        )}

        {/* ===== MODULE SCREENS ===== */}
      
        {active === "send" && <SendCampaign onBack={() => setActive("dashboard")}/>}
        {active === "create" && <CampaignMessages onBack={() => setActive("dashboard")} />}
        {active === "history" && <SendHistory onBack={() => setActive("dashboard")}/>}

      </div>
    </>
  );
}
