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
  status: "Approved" | "Scheduled";
  eta: string;
};

type ChatMessage = {
  id: string;
  role: ChatRole;
  content: string;
};

const tabs: { id: MainTab; label: string }[] = [
  { id: "estimate", label: "Price Estimate" },
  { id: "schedule", label: "Schedule" },
  { id: "mechanic", label: "Mechanic" },
];

const jobs: Job[] = [
  {
    id: "AG-2038",
    customer: "Maya Thompson",
    vehicle: "2019 Toyota RAV4 XLE",
    issue: "Front bumper scrape and brake pull",
    status: "Approved",
    eta: "Tue 9:00 AM",
  },
  {
    id: "AG-2041",
    customer: "Jordan Patel",
    vehicle: "2021 Honda Accord Sport",
    issue: "Rear quarter panel dent",
    status: "Approved",
    eta: "Tue 1:30 PM",
  },
  {
    id: "AG-2044",
    customer: "Lauren Kim",
    vehicle: "2018 Subaru Outback",
    issue: "Bumper crack and sensor alert",
    status: "Scheduled",
    eta: "Wed 10:15 AM",
  },
];

const slots = [
  { date: "Tue, Mar 10", time: "9:00 AM", mechanic: "Marco Chen" },
  { date: "Tue, Mar 10", time: "1:30 PM", mechanic: "Priya Shah" },
  { date: "Wed, Mar 11", time: "10:15 AM", mechanic: "Jordan Lee" },
];

const lineItems = [
  { label: "Bumper refinish", value: "$420" },
  { label: "Bracket replacement", value: "$160" },
  { label: "Panel blend", value: "$185" },
  { label: "Labor + calibration", value: "$240" },
];

const starterChat: ChatMessage[] = [
  {
    id: "assistant-1",
    role: "assistant",
    content: "How can I help with this repair?",
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
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(starterChat);
  const [isReplying, setIsReplying] = useState(false);
  const [ticket, setTicket] = useState({
    customer: "Maya Thompson",
    vehicle: "2019 Toyota RAV4 XLE",
    mileage: "58,240",
    photos: "4",
    symptoms: "Front bumper scrape, slight brake pull, dashboard warning.",
  });

  const selectedJob = jobs.find((j) => j.id === selectedJobId) ?? jobs[0];

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
    setChatMessages(starterChat);
    setChatInput("");
    setIsReplying(false);
  }

  function selectJob(jobId: string) {
    setSelectedJobId(jobId);
    setChatMessages(starterChat);
    setChatInput("");
    setIsReplying(false);
  }

  function sendChat() {
    if (!chatInput.trim() || isReplying) return;

    setChatMessages((current) => [
      ...current,
      { id: `u-${Date.now()}`, role: "user", content: chatInput.trim() },
    ]);
    setChatInput("");
    setIsReplying(true);

    window.setTimeout(() => {
      setChatMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: "Thank you for your query",
        },
      ]);
      setIsReplying(false);
    }, 550);
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f9fc_0%,#eef2f8_100%)] px-4 py-5 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="overflow-hidden rounded-[30px] border border-slate-200/70 bg-[linear-gradient(135deg,#0b1320_0%,#121f36_58%,#0a6a7d_100%)] px-6 py-7 text-white shadow-[0_24px_55px_rgba(2,6,23,0.2)] sm:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-200">
                Agenticar Services
              </p>
              <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">
                Smart repair workflow
              </h1>
              <p className="mt-2 text-sm text-slate-300 sm:text-base">
                Estimate, schedule, and mechanic operations in one flow.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <TopMetric label="Estimate" value={estimateStatus} />
              <TopMetric
                label="Slot"
                value={
                  estimateStatus === "approved"
                    ? slots[selectedSlot].time
                    : "Pending"
                }
              />
              <TopMetric label="Queue" value="2 approved" />
            </div>
          </div>
        </header>

        <section className="rounded-[28px] border border-slate-200/70 bg-white/90 p-2 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
          <div className="grid gap-2 md:grid-cols-3">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-[20px] px-4 py-4 text-left transition ${
                    active
                      ? "bg-slate-950 text-white shadow-md"
                      : "bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <p className="text-sm font-semibold">{tab.label}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[30px] border border-slate-200/70 bg-white p-6 shadow-[0_16px_40px_rgba(15,23,42,0.07)] sm:p-7">
            {activeTab === "estimate" && (
              <div className="space-y-5">
                <SectionTitle
                  title="Generate Price Estimate"
                  subtitle="Capture details and create an instant exterior estimate."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Customer"
                    value={ticket.customer}
                    onChange={(value) =>
                      setTicket((c) => ({ ...c, customer: value }))
                    }
                  />
                  <Field
                    label="Vehicle"
                    value={ticket.vehicle}
                    onChange={(value) =>
                      setTicket((c) => ({ ...c, vehicle: value }))
                    }
                  />
                  <Field
                    label="Mileage"
                    value={ticket.mileage}
                    onChange={(value) =>
                      setTicket((c) => ({ ...c, mileage: value }))
                    }
                  />
                  <Field
                    label="Photos"
                    value={ticket.photos}
                    onChange={(value) =>
                      setTicket((c) => ({ ...c, photos: value }))
                    }
                  />
                </div>

                <Field
                  label="Symptoms"
                  value={ticket.symptoms}
                  textarea
                  onChange={(value) => setTicket((c) => ({ ...c, symptoms: value }))}
                />

                <div className="rounded-[24px] bg-slate-950 p-4 text-white">
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    Estimate
                  </p>
                  <p className="mt-1 text-3xl font-semibold">
                    {estimateStatus === "draft" ? "--" : "$1,005"}
                  </p>
                  <div className="mt-4 space-y-2">
                    {lineItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                      >
                        <span className="text-slate-300">{item.label}</span>
                        <span className="font-semibold">
                          {estimateStatus === "draft" ? "--" : item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <PrimaryButton onClick={generateEstimate}>
                    Generate Estimate
                  </PrimaryButton>
                  <GhostButton
                    onClick={approveEstimate}
                    disabled={estimateStatus !== "generated"}
                  >
                    Approve & Continue
                  </GhostButton>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-5">
                <SectionTitle
                  title="Schedule Appointment"
                  subtitle="Route to the best available mechanic slot."
                />

                <div className="grid gap-3 sm:grid-cols-2">
                  <ModeCard
                    title="Calendar Sync"
                    active={scheduleMode === "calendar-sync"}
                    onClick={() => setScheduleMode("calendar-sync")}
                  />
                  <ModeCard
                    title="Shop Availability"
                    active={scheduleMode === "shop-availability"}
                    onClick={() => setScheduleMode("shop-availability")}
                  />
                </div>

                <div className="space-y-2">
                  {slots.map((slot, index) => {
                    const active = selectedSlot === index;
                    return (
                      <button
                        key={`${slot.date}-${slot.time}`}
                        type="button"
                        onClick={() => setSelectedSlot(index)}
                        className={`w-full rounded-[18px] border px-4 py-3 text-left transition ${
                          active
                            ? "border-slate-950 bg-slate-950 text-white"
                            : "border-slate-200 bg-white hover:border-slate-400"
                        }`}
                      >
                        <p className="font-semibold">
                          {slot.date} · {slot.time}
                        </p>
                        <p
                          className={`text-sm ${
                            active ? "text-slate-300" : "text-slate-500"
                          }`}
                        >
                          {slot.mechanic}
                        </p>
                      </button>
                    );
                  })}
                </div>

                <PrimaryButton onClick={confirmAppointment}>
                  Confirm Appointment
                </PrimaryButton>
              </div>
            )}

            {activeTab === "mechanic" && (
              <div className="space-y-5">
                <SectionTitle
                  title="Mechanic Workspace"
                  subtitle="Open approved requests and chat for repair support."
                />

                <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
                  <div className="space-y-2">
                    {jobs.map((job) => {
                      const active = selectedJobId === job.id;
                      return (
                        <button
                          key={job.id}
                          type="button"
                          onClick={() => selectJob(job.id)}
                          className={`w-full rounded-[18px] border px-4 py-3 text-left transition ${
                            active
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-slate-200 bg-white hover:border-slate-400"
                          }`}
                        >
                          <p className="text-sm font-semibold text-slate-950">
                            {job.id} · {job.customer}
                          </p>
                          <p className="text-sm text-slate-600">{job.vehicle}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {job.issue} · {job.eta}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-[22px] border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedJob.id} · {selectedJob.vehicle}
                    </p>
                    <p className="text-sm text-slate-600">{selectedJob.issue}</p>

                    <div className="mt-4 h-64 space-y-2 overflow-y-auto rounded-[16px] bg-slate-950 p-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`max-w-[84%] rounded-[14px] px-3 py-2 text-sm ${
                            message.role === "assistant"
                              ? "bg-white/10 text-slate-100"
                              : "ml-auto bg-cyan-400 text-slate-950"
                          }`}
                        >
                          {message.content}
                        </div>
                      ))}
                      {isReplying && (
                        <div className="max-w-[84%] rounded-[14px] bg-white/10 px-3 py-2 text-sm text-slate-200">
                          ...
                        </div>
                      )}
                    </div>

                    <div className="mt-3 flex gap-2">
                      <input
                        value={chatInput}
                        onChange={(event) => setChatInput(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            sendChat();
                          }
                        }}
                        placeholder="Ask a question"
                        className="min-w-0 flex-1 rounded-[12px] border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-slate-900"
                      />
                      <button
                        type="button"
                        onClick={sendChat}
                        className="rounded-[12px] bg-slate-950 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-4">
            <div className="rounded-[30px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Quick view
              </p>
              <div className="mt-3 space-y-2">
                <MiniStat label="Customer" value={ticket.customer} />
                <MiniStat label="Vehicle" value={ticket.vehicle} />
                <MiniStat
                  label="Selected slot"
                  value={`${slots[selectedSlot].date} ${slots[selectedSlot].time}`}
                />
              </div>
            </div>

            <div className="rounded-[30px] border border-slate-200/70 bg-white p-5 shadow-[0_16px_40px_rgba(15,23,42,0.07)]">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Outcomes
              </p>
              <div className="mt-3 space-y-2">
                <MetricRow label="Quote to booking" value="+18%" />
                <MetricRow label="Intake time" value="-12 min" />
                <MetricRow label="Resolution speed" value="-38%" />
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-950">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
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
  const cls =
    "w-full rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-slate-900 focus:bg-white";

  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-600">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cls}
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className={cls}
        />
      )}
    </label>
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-full bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-full border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition ${
        disabled
          ? "cursor-not-allowed opacity-40"
          : "hover:border-slate-900 hover:bg-slate-50"
      }`}
    >
      {children}
    </button>
  );
}

function ModeCard({
  title,
  active,
  onClick,
}: {
  title: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[18px] border px-4 py-4 text-left transition ${
        active
          ? "border-slate-950 bg-slate-950 text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
      }`}
    >
      <p className="text-sm font-semibold">{title}</p>
    </button>
  );
}

function TopMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/12 bg-white/10 px-3 py-2 text-center">
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-300">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold capitalize text-white">{value}</p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-[11px] uppercase tracking-[0.14em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-slate-900">{value}</p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[14px] border border-slate-200 bg-slate-50 px-3 py-2">
      <p className="text-sm text-slate-600">{label}</p>
      <p className="text-sm font-semibold text-slate-900">{value}</p>
    </div>
  );
}
