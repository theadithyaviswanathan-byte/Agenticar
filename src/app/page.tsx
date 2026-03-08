"use client";

import { useMemo, useState, type ReactNode } from "react";

type TopTab = "customer" | "service";
type CustomerTab = "estimate" | "schedule";
type ServiceTab = "pipeline" | "kpi";
type EstimateStatus = "draft" | "generated" | "approved";
type ScheduleMode = "calendar-sync" | "shop-availability";

type Job = {
  id: string;
  customer: string;
  vehicle: string;
  issue: string;
  status: "Approved" | "Scheduled" | "In Progress";
  eta: string;
};

type ServiceSlot = {
  id: string;
  mechanic: string;
  primary: string;
  alternates: string[];
  recentVisits: number;
};

type KpiMetric = {
  label: string;
  value: string;
  delta: string;
  series: number[];
};

const customerTabs: { id: CustomerTab; label: string }[] = [
  { id: "estimate", label: "Price Estimate" },
  { id: "schedule", label: "Schedule" },
];

const serviceTabs: { id: ServiceTab; label: string }[] = [
  { id: "pipeline", label: "Service Pipeline" },
  { id: "kpi", label: "KPIs" },
];

const jobs: Job[] = [
  {
    id: "AG-2038",
    customer: "Maya Thompson",
    vehicle: "2019 Toyota RAV4 XLE",
    issue: "Front bumper scrape and brake pull",
    status: "Scheduled",
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
    status: "In Progress",
    eta: "Wed 10:15 AM",
  },
];

const serviceSlots: ServiceSlot[] = [
  {
    id: "slot-1",
    mechanic: "Marco Chen",
    primary: "Tue, Mar 10 · 9:00 AM",
    alternates: ["Tue, Mar 10 · 11:15 AM", "Wed, Mar 11 · 8:45 AM"],
    recentVisits: 4,
  },
  {
    id: "slot-2",
    mechanic: "Priya Shah",
    primary: "Tue, Mar 10 · 1:30 PM",
    alternates: ["Wed, Mar 11 · 12:30 PM", "Thu, Mar 12 · 9:45 AM"],
    recentVisits: 2,
  },
  {
    id: "slot-3",
    mechanic: "Jordan Lee",
    primary: "Wed, Mar 11 · 10:15 AM",
    alternates: ["Wed, Mar 11 · 2:00 PM", "Thu, Mar 12 · 11:00 AM"],
    recentVisits: 1,
  },
];

const lineItems = [
  { label: "Bumper refinish", value: "$420" },
  { label: "Bracket replacement", value: "$160" },
  { label: "Panel blend", value: "$185" },
  { label: "Labor + calibration", value: "$240" },
];

const kpiMetrics: KpiMetric[] = [
  {
    label: "Quote to booking",
    value: "68%",
    delta: "+18%",
    series: [45, 49, 52, 56, 61, 64, 68],
  },
  {
    label: "Avg intake time",
    value: "14 min",
    delta: "-12 min",
    series: [31, 29, 26, 24, 20, 16, 14],
  },
  {
    label: "Resolution speed",
    value: "2.9 days",
    delta: "-38%",
    series: [4.9, 4.6, 4.2, 3.8, 3.5, 3.2, 2.9],
  },
];

export default function Home() {
  const [activeTopTab, setActiveTopTab] = useState<TopTab>("customer");
  const [activeCustomerTab, setActiveCustomerTab] =
    useState<CustomerTab>("estimate");
  const [activeServiceTab, setActiveServiceTab] = useState<ServiceTab>("pipeline");
  const [estimateStatus, setEstimateStatus] = useState<EstimateStatus>("draft");
  const [scheduleMode, setScheduleMode] =
    useState<ScheduleMode>("calendar-sync");
  const [selectedSlotId, setSelectedSlotId] = useState(serviceSlots[0].id);
  const [uploadedPhotos, setUploadedPhotos] = useState<File[]>([]);
  const [ticket, setTicket] = useState({
    customer: "Maya Thompson",
    vehicle: "2019 Toyota RAV4 XLE",
    mileage: "58,240",
    symptoms: "Front bumper scrape, slight brake pull, dashboard warning.",
  });

  const preferredSupport = useMemo(
    () =>
      serviceSlots.reduce((top, slot) =>
        slot.recentVisits > top.recentVisits ? slot : top,
      ),
    [],
  );
  const selectedSlot =
    serviceSlots.find((slot) => slot.id === selectedSlotId) ?? serviceSlots[0];

  function generateEstimate() {
    setEstimateStatus("generated");
  }

  function approveEstimate() {
    setEstimateStatus("approved");
    setActiveCustomerTab("schedule");
  }

  function confirmAppointment() {
    setActiveTopTab("service");
    setActiveServiceTab("pipeline");
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
          <div className="grid gap-2 sm:grid-cols-2">
            <TabButton
              label="Customer"
              active={activeTopTab === "customer"}
              onClick={() => setActiveTopTab("customer")}
            />
            <TabButton
              label="Service Team"
              active={activeTopTab === "service"}
              onClick={() => setActiveTopTab("service")}
            />
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[24px] border border-black/10 bg-white p-6">
            {activeTopTab === "customer" && (
              <div className="space-y-5">
                <div className="grid gap-2 sm:grid-cols-2">
                  {customerTabs.map((tab) => (
                    <TabButton
                      key={tab.id}
                      label={tab.label}
                      active={activeCustomerTab === tab.id}
                      onClick={() => setActiveCustomerTab(tab.id)}
                    />
                  ))}
                </div>

                {activeCustomerTab === "estimate" && (
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
                      <span className="mb-1 block text-sm text-black/65">
                        Photos
                      </span>
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
                    </label>

                    <Field
                      label="Symptoms"
                      value={ticket.symptoms}
                      textarea
                      onChange={(value) =>
                        setTicket((current) => ({ ...current, symptoms: value }))
                      }
                    />

                    <EstimateCard estimateStatus={estimateStatus} />

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

                {activeCustomerTab === "schedule" && (
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

                    <p className="rounded-[12px] border border-blue-500/20 bg-blue-50 px-4 py-2 text-sm text-blue-800">
                      These slots are based on current service team availability.
                    </p>

                    <div className="space-y-3">
                      {serviceSlots.map((slot) => {
                        const active = slot.id === selectedSlotId;
                        const isPreferred = slot.mechanic === preferredSupport.mechanic;
                        return (
                          <button
                            key={slot.id}
                            type="button"
                            onClick={() => setSelectedSlotId(slot.id)}
                            className={`w-full rounded-[16px] border px-4 py-3 text-left transition ${
                              active
                                ? "border-blue-500 bg-blue-50"
                                : "border-black/10 bg-white hover:border-blue-500"
                            } ${isPreferred ? "border-2 border-black font-semibold" : ""}`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <p className="text-base text-black">{slot.mechanic}</p>
                              {isPreferred && (
                                <span className="rounded-full bg-black px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-white">
                                  Your preferred support
                                </span>
                              )}
                            </div>
                            <p className="mt-1 text-sm text-black/75">
                              Primary: {slot.primary}
                            </p>
                            <p className="mt-1 text-xs text-black/55">
                              Alternate slots: {slot.alternates.join(" • ")}
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
              </div>
            )}

            {activeTopTab === "service" && (
              <div className="space-y-5">
                <div className="grid gap-2 sm:grid-cols-2">
                  {serviceTabs.map((tab) => (
                    <TabButton
                      key={tab.id}
                      label={tab.label}
                      active={activeServiceTab === tab.id}
                      onClick={() => setActiveServiceTab(tab.id)}
                    />
                  ))}
                </div>

                {activeServiceTab === "pipeline" && (
                  <div className="space-y-4">
                    <SectionTitle title="Service Pipeline" />
                    <p className="text-sm text-black/60">
                      Customers up next based on approved estimates and booked
                      availability.
                    </p>
                    <div className="space-y-2">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          className="rounded-[14px] border border-black/10 bg-white px-4 py-3"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-semibold text-black">
                              {job.id} · {job.customer}
                            </p>
                            <StatusPill status={job.status} />
                          </div>
                          <p className="text-sm text-black/70">{job.vehicle}</p>
                          <p className="text-xs text-black/50">
                            {job.issue} · {job.eta}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeServiceTab === "kpi" && (
                  <div className="space-y-4">
                    <SectionTitle title="Service Team KPIs" />
                    <div className="grid gap-3">
                      {kpiMetrics.map((metric) => (
                        <KpiCard key={metric.label} metric={metric} />
                      ))}
                    </div>
                  </div>
                )}
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
                <MiniStat label="Selected support" value={selectedSlot.mechanic} />
                <MiniStat label="Booked slot" value={selectedSlot.primary} />
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

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-[14px] border px-4 py-3 text-left transition ${
        active
          ? "border-black bg-black text-white"
          : "border-black/10 bg-white text-black hover:border-blue-500"
      }`}
    >
      <p className="text-sm font-semibold">{label}</p>
    </button>
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

function EstimateCard({ estimateStatus }: { estimateStatus: EstimateStatus }) {
  return (
    <div className="rounded-[18px] border border-blue-500/20 bg-blue-50 p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-blue-700">Estimate</p>
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
  );
}

function PrimaryButton({
  children,
  onClick,
}: {
  children: ReactNode;
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
  children: ReactNode;
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

function StatusPill({ status }: { status: Job["status"] }) {
  const className =
    status === "In Progress"
      ? "bg-amber-50 text-amber-800 border-amber-200"
      : status === "Scheduled"
        ? "bg-blue-50 text-blue-700 border-blue-200"
        : "bg-emerald-50 text-emerald-700 border-emerald-200";
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs ${className}`}>
      {status}
    </span>
  );
}

function KpiCard({ metric }: { metric: KpiMetric }) {
  const min = Math.min(...metric.series);
  const max = Math.max(...metric.series);
  const range = max - min || 1;

  return (
    <div className="rounded-[16px] border border-blue-500/20 bg-blue-50 p-4">
      <div className="flex items-end justify-between gap-2">
        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-blue-700">
            {metric.label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-black">{metric.value}</p>
        </div>
        <p className="text-sm font-semibold text-blue-700">{metric.delta}</p>
      </div>
      <div className="mt-3 flex h-20 items-end gap-1.5">
        {metric.series.map((point, index) => {
          const height = 20 + ((point - min) / range) * 60;
          return (
            <div
              key={`${metric.label}-${index}`}
              className="flex-1 rounded-t-sm bg-blue-500/75"
              style={{ height: `${height}%` }}
            />
          );
        })}
      </div>
    </div>
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
