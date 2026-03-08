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
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [ticket, setTicket] = useState({
    customer: "Maya Thompson",
    vehicle: "2019 Toyota RAV4 XLE",
    mileage: "58,240",
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
    }, 500);
  }

  return (
    <main className="min-h-screen bg-white px-4 py-5 text-black sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        <header className="rounded-[24px] border border-black bg-black px-6 py-8 text-white">
          <p className="text-xs uppercase tracking-[0.22em] text-blue-300">
            Agenticar Services
          </p>
          <h1 className="mt-2 text-4xl font-semibold leading-tight">
            Precision repair workflow.
          </h1>
          <p className="mt-2 text-lg text-blue-100">
            Quote. Schedule. Service.
          </p>
        </header>

        <section className="rounded-[20px] border border-black/10 bg-white p-2">
          <div className="grid gap-2 md:grid-cols-3">
            {tabs.map((tab) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`rounded-[14px] border px-4 py-3 text-left transition ${
                    active
                      ? "border-black bg-black text-white"
                      : "border-black/10 bg-white text-black hover:border-blue-500"
                  }`}
                >
                  <p className="text-sm font-semibold">{tab.label}</p>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[24px] border border-black/10 bg-white p-6">
            {activeTab === "estimate" && (
              <div className="space-y-5">
                <SectionTitle title="Generate Price Estimate" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field
                    label="Customer"
                    value={ticket.customer}
                    onChange={(value) =>
                      setTicket((current) => ({ ...current, customer: value }))
                    }
                  />
                  <Field
                    label="Vehicle"
                    value={ticket.vehicle}
                    onChange={(value) =>
                      setTicket((current) => ({ ...current, vehicle: value }))
                    }
                  />
                  <Field
                    label="Mileage"
                    value={ticket.mileage}
                    onChange={(value) =>
                      setTicket((current) => ({ ...current, mileage: value }))
                    }
                  />
                </div>

                <label className="block">
                  <span className="mb-1 block text-sm text-black/65">Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => {
                      const files = event.target.files;
                      setUploadedPhotos(files ? Array.from(files) : []);
                    }}
                    className="w-full rounded-[10px] border border-black/15 bg-white px-3 py-2 text-sm outline-none file:mr-3 file:rounded-full file:border-0 file:bg-black file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-white hover:file:bg-blue-600 focus:border-blue-500"
                  />
                  <p className="mt-2 text-xs text-black/55">
                    {uploadedPhotos.length > 0
                      ? `${uploadedPhotos.length} image${uploadedPhotos.length === 1 ? "" : "s"} selected`
                      : "No images selected"}
                  </p>
                  {uploadedPhotos.length > 0 && (
                    <ul className="mt-2 space-y-1 text-xs text-black/65">
                      {uploadedPhotos.slice(0, 3).map((file) => (
                        <li key={`${file.name}-${file.lastModified}`}>
                          {file.name}
                        </li>
                      ))}
                      {uploadedPhotos.length > 3 && (
                        <li>+{uploadedPhotos.length - 3} more</li>
                      )}
                    </ul>
                  )}
                </label>

                <Field
                  label="Symptoms"
                  value={ticket.symptoms}
                  textarea
                  onChange={(value) =>
                    setTicket((current) => ({ ...current, symptoms: value }))
                  }
                />

                <div className="rounded-[18px] border border-blue-500/20 bg-blue-50 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-blue-700">
                    Estimate
                  </p>
                  <p className="mt-1 text-3xl font-semibold text-black">
                    {estimateStatus === "draft" ? "--" : "$1,005"}
                  </p>
                  <div className="mt-3 space-y-2">
                    {lineItems.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-3 py-2 text-sm"
                      >
                        <span className="text-black/70">{item.label}</span>
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
                  <SecondaryButton
                    onClick={approveEstimate}
                    disabled={estimateStatus !== "generated"}
                  >
                    Approve & Continue
                  </SecondaryButton>
                </div>
              </div>
            )}

            {activeTab === "schedule" && (
              <div className="space-y-5">
                <SectionTitle title="Schedule Appointment" />

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
                        className={`w-full rounded-[14px] border px-4 py-3 text-left transition ${
                          active
                            ? "border-blue-500 bg-blue-50"
                            : "border-black/10 bg-white hover:border-blue-500"
                        }`}
                      >
                        <p className="font-semibold text-black">
                          {slot.date} · {slot.time}
                        </p>
                        <p className="text-sm text-black/60">{slot.mechanic}</p>
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
                <SectionTitle title="Mechanic Workspace" />
                <div className="grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
                  <div className="space-y-2">
                    {jobs.map((job) => {
                      const active = selectedJobId === job.id;
                      return (
                        <button
                          key={job.id}
                          type="button"
                          onClick={() => selectJob(job.id)}
                          className={`w-full rounded-[14px] border px-4 py-3 text-left transition ${
                            active
                              ? "border-blue-500 bg-blue-50"
                              : "border-black/10 bg-white hover:border-blue-500"
                          }`}
                        >
                          <p className="text-sm font-semibold text-black">
                            {job.id} · {job.customer}
                          </p>
                          <p className="text-sm text-black/70">{job.vehicle}</p>
                          <p className="text-xs text-black/50">
                            {job.issue} · {job.eta}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="rounded-[18px] border border-black/10 bg-white p-4">
                    <p className="text-sm font-semibold text-black">
                      {selectedJob.id} · {selectedJob.vehicle}
                    </p>
                    <p className="text-sm text-black/60">{selectedJob.issue}</p>

                    <div className="mt-4 h-64 space-y-2 overflow-y-auto rounded-[14px] border border-black/10 bg-black p-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`max-w-[84%] rounded-[12px] px-3 py-2 text-sm ${
                            message.role === "assistant"
                              ? "bg-white/10 text-white"
                              : "ml-auto bg-blue-500 text-white"
                          }`}
                        >
                          {message.content}
                        </div>
                      ))}
                      {isReplying && (
                        <div className="max-w-[84%] rounded-[12px] bg-white/10 px-3 py-2 text-sm text-white">
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
                        className="min-w-0 flex-1 rounded-[10px] border border-black/20 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
                      />
                      <button
                        type="button"
                        onClick={sendChat}
                        className="rounded-[10px] bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
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
            <div className="rounded-[24px] border border-black/10 bg-white p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-black/45">
                Snapshot
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

            <div className="rounded-[24px] border border-blue-500/20 bg-blue-50 p-5">
              <p className="text-xs uppercase tracking-[0.18em] text-blue-700">
                KPI
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

function SectionTitle({ title }: { title: string }) {
  return <h2 className="text-2xl font-semibold text-black">{title}</h2>;
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
    "w-full rounded-[10px] border border-black/15 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500";

  return (
    <label className="block">
      <span className="mb-1 block text-sm text-black/65">{label}</span>
      {textarea ? (
        <textarea
          rows={3}
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
      className="rounded-full bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-600"
    >
      {children}
    </button>
  );
}

function SecondaryButton({
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
      className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
        disabled
          ? "cursor-not-allowed border-black/20 text-black/35"
          : "border-black text-black hover:border-blue-500 hover:text-blue-600"
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
      className={`rounded-[14px] border px-4 py-3 text-left transition ${
        active
          ? "border-blue-500 bg-blue-50 text-black"
          : "border-black/10 bg-white text-black hover:border-blue-500"
      }`}
    >
      <p className="text-sm font-semibold">{title}</p>
    </button>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[10px] border border-black/10 bg-white px-3 py-2">
      <p className="text-[10px] uppercase tracking-[0.14em] text-black/45">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-black">{value}</p>
    </div>
  );
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-[10px] border border-blue-500/20 bg-white px-3 py-2">
      <p className="text-sm text-black/70">{label}</p>
      <p className="text-sm font-semibold text-black">{value}</p>
    </div>
  );
}
