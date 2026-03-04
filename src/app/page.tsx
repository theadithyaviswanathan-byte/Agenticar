"use client";

import { useState } from "react";

type MainTab = "estimate" | "schedule" | "mechanic";
type EstimateStatus = "draft" | "generated" | "approved";
type ScheduleMode = "calendar-sync" | "shop-availability";
type ChatRole = "user" | "assistant";

type Job = {
  id: string;
  customer: string;
  vehicle: string;
  issue: string;
  shop: string;
  status: "Awaiting approval" | "Approved" | "Scheduled";
  eta: string;
};

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const tabs: { id: MainTab; label: string; subtitle: string }[] = [
  {
    id: "estimate",
    label: "Generate Price Estimate",
    subtitle: "Customer intake, guided photo flow, and ML-based exterior estimate.",
  },
  {
    id: "schedule",
    label: "Schedule Appointment",
    subtitle: "Rules-based routing after estimate approval and calendar preference capture.",
  },
  {
    id: "mechanic",
    label: "Mechanic Login",
    subtitle: "Approved jobs queue plus a mocked repair assistant chat experience.",
  },
];

const mockJobs: Job[] = [
  {
    id: "AG-2038",
    customer: "Maya Thompson",
    vehicle: "2019 Toyota RAV4 XLE",
    issue: "Front bumper scrape, brake pull, warning light after impact",
    shop: "Bellevue North",
    status: "Approved",
    eta: "9:00 AM tomorrow",
  },
  {
    id: "AG-2041",
    customer: "Jordan Patel",
    vehicle: "2021 Honda Accord Sport",
    issue: "Rear quarter panel dent and paint transfer",
    shop: "Seattle Central",
    status: "Approved",
    eta: "1:30 PM tomorrow",
  },
  {
    id: "AG-2044",
    customer: "Lauren Kim",
    vehicle: "2018 Subaru Outback Premium",
    issue: "Parking-lot bumper crack and sensor alert",
    shop: "Redmond East",
    status: "Scheduled",
    eta: "10:15 AM Wednesday",
  },
];

const approvedSlots = [
  {
    date: "Tue, Mar 10",
    time: "9:00 AM",
    mechanic: "Marco Chen",
    skill: "Collision + brake diagnostics",
  },
  {
    date: "Tue, Mar 10",
    time: "1:30 PM",
    mechanic: "Priya Shah",
    skill: "ADAS and body alignment",
  },
  {
    date: "Wed, Mar 11",
    time: "10:15 AM",
    mechanic: "Jordan Lee",
    skill: "General service and intake",
  },
];

const checklistItems = [
  "Verify damage is limited to photo-visible exterior surfaces",
  "Inspect brake pull symptom separately during intake road test",
  "Review prior rotor and pad service history from internal records",
  "Check ADAS mount alignment behind front fascia",
  "Escalate any hidden structural or mechanical findings to in-shop inspection",
];

const priceRows = [
  { label: "Front bumper refinish", value: "$420" },
  { label: "Headlamp bracket replacement", value: "$160" },
  { label: "Panel blend and paint correction", value: "$185" },
  { label: "Calibration and labor reserve", value: "$240" },
];

const initialMessages: ChatMessage[] = [
  {
    id: "assistant-1",
    role: "assistant",
    content:
      "Mechanic assistant ready. Ask about repair approach, prior best practices, or likely trouble spots for this approved request.",
  },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<MainTab>("estimate");
  const [estimateStatus, setEstimateStatus] = useState<EstimateStatus>("draft");
  const [scheduleMode, setScheduleMode] =
    useState<ScheduleMode>("calendar-sync");
  const [selectedSlot, setSelectedSlot] = useState(0);
  const [selectedJobId, setSelectedJobId] = useState("AG-2038");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] =
    useState<ChatMessage[]>(initialMessages);
  const [isReplying, setIsReplying] = useState(false);
  const [ticket, setTicket] = useState({
    customerName: "Maya Thompson",
    makeModel: "2019 Toyota RAV4 XLE",
    symptoms:
      "Front bumper scrape, slight pull while braking, dashboard warning after minor parking-lot impact.",
    mileage: "58,240",
    photoCount: "4",
  });

  const selectedJob =
    mockJobs.find((job) => job.id === selectedJobId) ?? mockJobs[0];

  function generateEstimate() {
    setEstimateStatus("generated");
  }

  function approveEstimate() {
    setEstimateStatus("approved");
    setActiveTab("schedule");
  }

  function confirmAppointment() {
    setActiveTab("mechanic");
    setSelectedJobId("AG-2038");
  }

  function selectJob(jobId: string) {
    setSelectedJobId(jobId);
    setChatMessages(initialMessages);
    setChatInput("");
    setIsReplying(false);
  }

  function submitMechanicChat() {
    if (!chatInput.trim() || isReplying) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: chatInput.trim(),
    };

    setChatMessages((current) => [...current, userMessage]);
    setChatInput("");
    setIsReplying(true);

    window.setTimeout(() => {
      setChatMessages((current) => [
        ...current,
        {
          id: `assistant-${Date.now()}`,
          role: "assistant",
          content: "Thank you for your query",
        },
      ]);
      setIsReplying(false);
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,_#08111f_0%,_#0e1b2f_32%,_#edf2f8_32%,_#edf2f8_100%)] px-4 py-5 text-slate-950 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="relative overflow-hidden rounded-[36px] border border-cyan-300/15 bg-[linear-gradient(135deg,_rgba(7,17,32,0.98)_0%,_rgba(13,29,55,0.95)_56%,_rgba(7,81,89,0.9)_100%)] px-6 py-8 text-white shadow-[0_30px_80px_rgba(2,6,23,0.34)] sm:px-8 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.25),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(245,158,11,0.2),_transparent_22%)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1.3fr_0.78fr]">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-cyan-300/20 bg-white/8 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-100">
                Agenticar Services
              </div>
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold leading-tight sm:text-5xl">
                  A modern agentic workflow for auto repair quoting, scheduling,
                  and mechanic decision support.
                </h1>
                <p className="max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
                  This demo simulates the full customer-to-mechanic journey:
                  guided intake, photo-based estimate, rules-based scheduling,
                  and an internal repair assistant for approved jobs.
                </p>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <HeroMetric label="Customer certainty" value="Upfront estimate" />
                <HeroMetric label="Operational handoff" value="Auto-routed slot" />
                <HeroMetric label="Mechanic support" value="Repair chat panel" />
              </div>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/8 p-5 backdrop-blur-md">
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-100/70">
                Demo architecture
              </p>
              <div className="mt-4 space-y-3">
                <FlowPill title="LLM Intake" text="Captures symptoms, mileage, and uploaded damage photos." />
                <FlowPill title="ML Estimate" text="Returns a real-time exterior damage estimate with clear boundaries." />
                <FlowPill title="Rules Engine" text="Matches approved requests to nearby shop capacity and mechanic fit." />
                <FlowPill title="Mechanic RAG" text="Mocks access to prior fixes, OEM guidance, and shop best practices." />
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1fr_0.35fr]">
          <div className="rounded-[30px] border border-white/70 bg-white/90 p-3 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <div className="grid gap-3 lg:grid-cols-3">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-[24px] border px-5 py-5 text-left transition-all duration-200 ${
                      isActive
                        ? "border-slate-950 bg-slate-950 text-white shadow-[0_16px_35px_rgba(15,23,42,0.2)]"
                        : "border-slate-200 bg-white text-slate-700 hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-md"
                    }`}
                  >
                    <p
                      className={`text-xs font-semibold uppercase tracking-[0.2em] ${
                        isActive ? "text-slate-300" : "text-slate-400"
                      }`}
                    >
                      Workflow tab
                    </p>
                    <p className="mt-2 text-lg font-semibold">{tab.label}</p>
                    <p
                      className={`mt-2 text-sm leading-6 ${
                        isActive ? "text-slate-300" : "text-slate-500"
                      }`}
                    >
                      {tab.subtitle}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <aside className="rounded-[30px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Live status
            </p>
            <div className="mt-4 space-y-3">
              <StatusRow
                label="Estimate"
                value={
                  estimateStatus === "draft"
                    ? "Draft"
                    : estimateStatus === "generated"
                      ? "Generated"
                      : "Approved"
                }
              />
              <StatusRow
                label="Scheduling"
                value={
                  estimateStatus === "approved"
                    ? `Slot selected: ${approvedSlots[selectedSlot].time}`
                    : "Waiting for approval"
                }
              />
              <StatusRow
                label="Mechanic queue"
                value="2 approved jobs ready"
              />
            </div>
          </aside>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[34px] border border-white/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] sm:p-7">
            {activeTab === "estimate" && (
              <div className="space-y-6">
                <SectionHeader
                  eyebrow="Customer experience"
                  title="Generate a trusted exterior repair estimate"
                  description="This flow demonstrates the top-of-funnel customer journey. The user enters structured intake data, uploads mock photos, and receives a constrained estimate for photo-verifiable damage."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Customer name"
                    value={ticket.customerName}
                    onChange={(value) =>
                      setTicket((current) => ({ ...current, customerName: value }))
                    }
                  />
                  <Field
                    label="Vehicle"
                    value={ticket.makeModel}
                    onChange={(value) =>
                      setTicket((current) => ({ ...current, makeModel: value }))
                    }
                  />
                  <Field
                    label="Mileage"
                    value={ticket.mileage}
                    onChange={(value) =>
                      setTicket((current) => ({ ...current, mileage: value }))
                    }
                  />
                  <Field
                    label="Uploaded photos"
                    value={ticket.photoCount}
                    onChange={(value) =>
                      setTicket((current) => ({ ...current, photoCount: value }))
                    }
                  />
                </div>

                <Field
                  label="Customer-described symptoms"
                  value={ticket.symptoms}
                  textarea
                  onChange={(value) =>
                    setTicket((current) => ({ ...current, symptoms: value }))
                  }
                />

                <div className="grid gap-4 lg:grid-cols-[0.88fr_1.12fr]">
                  <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 p-5">
                    <p className="text-sm font-semibold text-slate-950">
                      Guided photo upload
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Mocked intake coaching would tell the customer to capture
                      damage in bright light, wide angle, close-up, and side
                      profile.
                    </p>
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {["Wide angle", "Close-up", "Side profile", "Context shot"].map(
                        (item) => (
                          <button
                            key={item}
                            type="button"
                            className="rounded-[22px] border border-slate-200 bg-white px-4 py-6 text-sm font-medium text-slate-700 transition hover:-translate-y-0.5 hover:border-slate-950 hover:shadow-sm"
                          >
                            {item}
                          </button>
                        ),
                      )}
                    </div>
                  </div>

                  <div className="rounded-[28px] bg-slate-950 p-5 text-white">
                    <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      ML estimate result
                    </p>
                    <p className="mt-2 text-3xl font-semibold">
                      {estimateStatus === "draft" ? "Awaiting generation" : "$1,005"}
                    </p>
                    <p className="mt-3 text-sm leading-6 text-slate-300">
                      Exterior damage is estimate-ready. Brake pull and warning
                      signals remain gated for in-shop inspection.
                    </p>
                    <div className="mt-5 space-y-3">
                      {priceRows.map((row) => (
                        <div
                          key={row.label}
                          className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm"
                        >
                          <span className="text-slate-300">{row.label}</span>
                          <span className="font-semibold text-white">
                            {estimateStatus === "draft" ? "--" : row.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <ActionButton onClick={generateEstimate} variant="primary">
                    Generate Estimate
                  </ActionButton>
                  <ActionButton
                    onClick={approveEstimate}
                    variant="secondary"
                    disabled={estimateStatus !== "generated"}
                  >
                    Approve Estimate and Continue
                  </ActionButton>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-6">
                <SectionHeader
                  eyebrow="Rules-based scheduling"
                  title="Route approved work to the best next appointment"
                  description="Once the estimate is approved, the scheduling engine matches request type, shop capacity, and customer preference to present a next-best slot."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setScheduleMode("calendar-sync")}
                    className={`rounded-[24px] border px-5 py-5 text-left transition ${
                      scheduleMode === "calendar-sync"
                        ? "border-cyan-500 bg-cyan-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      Customer authorizes calendar sync
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Use customer availability plus shop schedule to find a
                      matched slot automatically.
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleMode("shop-availability")}
                    className={`rounded-[24px] border px-5 py-5 text-left transition ${
                      scheduleMode === "shop-availability"
                        ? "border-amber-500 bg-amber-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-slate-400"
                    }`}
                  >
                    <p className="text-sm font-semibold text-slate-950">
                      Customer declines sync
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Show nearby location availability based only on internal
                      scheduling data.
                    </p>
                  </button>
                </div>

                <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-950">
                    Scheduling rule output
                  </p>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {scheduleMode === "calendar-sync"
                      ? "Best fit uses customer calendar preference, collision capability, and earliest qualified mechanic."
                      : "Best fit ignores customer calendar data and proposes internal shop availability at nearby locations."}
                  </p>
                </div>

                <div className="grid gap-3">
                  {approvedSlots.map((slot, index) => {
                    const isSelected = selectedSlot === index;
                    return (
                      <button
                        key={`${slot.date}-${slot.time}`}
                        type="button"
                        onClick={() => setSelectedSlot(index)}
                        className={`grid gap-3 rounded-[24px] border px-4 py-4 text-left transition sm:grid-cols-[1fr_auto] sm:items-center ${
                          isSelected
                            ? "border-slate-950 bg-slate-950 text-white shadow-[0_14px_30px_rgba(15,23,42,0.18)]"
                            : "border-slate-200 bg-white hover:-translate-y-0.5 hover:border-slate-400 hover:shadow-sm"
                        }`}
                      >
                        <div>
                          <p className="text-lg font-semibold">
                            {slot.date} at {slot.time}
                          </p>
                          <p
                            className={`mt-1 text-sm ${
                              isSelected ? "text-slate-300" : "text-slate-600"
                            }`}
                          >
                            {slot.mechanic} • {slot.skill}
                          </p>
                        </div>
                        <div
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            isSelected
                              ? "bg-white/12 text-white"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {isSelected ? "Selected" : "Available"}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <ActionButton onClick={confirmAppointment} variant="primary">
                  Confirm Appointment
                </ActionButton>
              </div>
            )}

            {activeTab === "mechanic" && (
              <div className="space-y-6">
                <SectionHeader
                  eyebrow="Internal workflow"
                  title="Mechanic queue and repair assistant"
                  description="This screen represents the internal LLM workflow. Mechanics can open approved requests and use a mocked RAG-style chat panel for repair questions and institutional knowledge lookup."
                />

                <div className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
                  <div className="space-y-3">
                    {mockJobs.map((job) => {
                      const isSelected = selectedJobId === job.id;
                      return (
                        <button
                          key={job.id}
                          type="button"
                          onClick={() => selectJob(job.id)}
                          className={`w-full rounded-[24px] border px-4 py-4 text-left transition ${
                            isSelected
                              ? "border-emerald-500 bg-emerald-50 shadow-sm"
                              : "border-slate-200 bg-white hover:border-slate-400"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-slate-950">
                                {job.id} • {job.customer}
                              </p>
                              <p className="mt-1 text-sm text-slate-600">
                                {job.vehicle}
                              </p>
                            </div>
                            <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold text-white">
                              {job.status}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-600">
                            {job.issue}
                          </p>
                          <p className="mt-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                            {job.shop} • {job.eta}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                          Selected job
                        </p>
                        <h3 className="mt-1 text-2xl font-semibold text-slate-950">
                          {selectedJob.id} • {selectedJob.vehicle}
                        </h3>
                      </div>
                      <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm">
                        {selectedJob.status}
                      </span>
                    </div>

                    <div className="mt-5 grid gap-3 md:grid-cols-2">
                      <InfoCard label="Customer" value={selectedJob.customer} />
                      <InfoCard label="Location" value={selectedJob.shop} />
                      <InfoCard label="Issue" value={selectedJob.issue} />
                      <InfoCard label="Arrival" value={selectedJob.eta} />
                    </div>

                    <div className="mt-5 rounded-[24px] bg-white p-4">
                      <p className="text-sm font-semibold text-slate-950">
                        Generated intake checklist
                      </p>
                      <div className="mt-3 space-y-2">
                        {checklistItems.map((item) => (
                          <div
                            key={item}
                            className="flex items-start gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700"
                          >
                            <div className="mt-1 h-2.5 w-2.5 rounded-full bg-cyan-500" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5 rounded-[24px] bg-slate-950 p-4 text-white">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs uppercase tracking-[0.22em] text-slate-400">
                            Repair assistant chat
                          </p>
                          <p className="mt-1 text-sm text-slate-300">
                            Mocked RAG response layer for the mechanic workflow
                          </p>
                        </div>
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-cyan-100">
                          Demo mode
                        </span>
                      </div>

                      <div className="mt-4 h-72 space-y-3 overflow-y-auto rounded-[20px] border border-white/10 bg-black/15 p-3">
                        {chatMessages.map((message) => (
                          <div
                            key={message.id}
                            className={`max-w-[85%] rounded-[18px] px-4 py-3 text-sm leading-6 ${
                              message.role === "assistant"
                                ? "bg-white/10 text-slate-100"
                                : "ml-auto bg-cyan-400 text-slate-950"
                            }`}
                          >
                            {message.content}
                          </div>
                        ))}
                        {isReplying && (
                          <div className="max-w-[85%] rounded-[18px] bg-white/10 px-4 py-3 text-sm text-slate-200">
                            Thinking...
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex gap-3">
                        <input
                          value={chatInput}
                          onChange={(event) => setChatInput(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") {
                              event.preventDefault();
                              submitMechanicChat();
                            }
                          }}
                          placeholder="Ask about the repair plan, prior fixes, or likely trouble spots"
                          className="min-w-0 flex-1 rounded-[18px] border border-white/10 bg-white/8 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-400 focus:border-cyan-300"
                        />
                        <button
                          type="button"
                          onClick={submitMechanicChat}
                          className="rounded-[18px] bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                        >
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="rounded-[34px] border border-white/80 bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Demo script
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">
                What to narrate live
              </h2>
              <div className="mt-5 space-y-3">
                <ScriptCard
                  title="1. Start with the customer view"
                  body="Show the intake and explain that only exterior damage gets a model-based price estimate."
                />
                <ScriptCard
                  title="2. Approve and route"
                  body="Move into scheduling and explain how the rules engine handles calendar authorization or internal-only availability."
                />
                <ScriptCard
                  title="3. End with the mechanic workflow"
                  body="Open an approved job and show the repair assistant chat as the institutional knowledge layer."
                />
              </div>
            </div>

            <div className="rounded-[34px] border border-white/80 bg-[linear-gradient(180deg,_#fffdf8_0%,_#f5efe4_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
                Business metrics
              </p>
              <div className="mt-4 space-y-3">
                <MetricStrip label="Quote-to-book rate" value="+18%" />
                <MetricStrip label="Manual intake time" value="-12 min" />
                <MetricStrip label="Mean-time-to-resolution" value="-38%" />
                <MetricStrip label="Mechanic job time" value="-10%" />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
        {title}
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
}) {
  const className =
    "w-full rounded-[18px] border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-950 focus:bg-white";

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {textarea ? (
        <textarea
          rows={4}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={className}
        />
      )}
    </label>
  );
}

function ActionButton({
  children,
  onClick,
  variant,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant: "primary" | "secondary";
  disabled?: boolean;
}) {
  const styles =
    variant === "primary"
      ? "bg-slate-950 text-white hover:bg-slate-800"
      : "bg-white text-slate-950 border border-slate-300 hover:border-slate-950";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full px-5 py-3 text-sm font-semibold transition ${styles} ${
        disabled ? "cursor-not-allowed opacity-40 hover:bg-inherit" : ""
      }`}
    >
      {children}
    </button>
  );
}

function HeroMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[24px] border border-white/12 bg-white/8 p-4 backdrop-blur">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-300">
        {label}
      </p>
      <p className="mt-2 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function FlowPill({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-300">{text}</p>
    </div>
  );
}

function StatusRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[20px] border border-slate-200 bg-slate-50 px-4 py-4">
      <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function ScriptCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
      <p className="text-sm font-semibold text-slate-950">{title}</p>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function MetricStrip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[20px] border border-amber-200 bg-white/80 px-4 py-4">
      <p className="text-sm text-slate-700">{label}</p>
      <p className="text-lg font-semibold text-slate-950">{value}</p>
    </div>
  );
}
