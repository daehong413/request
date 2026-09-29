"use client";

import { useRef, useState } from "react";
import {
  Inquiry,
  InquiryErrors,
  scopes,
  sizes,
  validateInquiry,
} from "@/lib/contact";
import AddressSearch from "./AddressSearch";
import { Arrow } from "./Icons";

const fieldIds: Record<string, string> = {
  address: "estimate-address",
  size: "size-0",
  scope: "scope-0",
  name: "estimate-name",
  phone: "estimate-phone",
  confirmed: "estimate-confirmed",
};
export default function ContactForm({ regionName }: { regionName?: string }) {
  const [expanded, setExpanded] = useState(false);
  const [review, setReview] = useState(false);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState("");
  const sendLock = useRef(false);
  const [data, setData] = useState<Inquiry>({
    address: "",
    size: "",
    scope: "",
    name: "",
    phone: "",
    message: "",
    confirmed: false,
  });
  const [errors, setErrors] = useState<InquiryErrors>({});
  const heading = useRef<HTMLHeadingElement>(null);
  async function sendInquiry() {
    if (sendLock.current || sent) return;
    sendLock.current = true;
    setSending(true);
    setSendError("");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (!response.ok || result.success !== true) {
        throw new Error(result.error || "메일 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
      setSent(true);
      requestAnimationFrame(() => heading.current?.focus());
    } catch (error) {
      setSendError(error instanceof Error && error.message !== "Failed to fetch"
        ? error.message
        : "전송 결과를 확인하지 못했습니다. 네트워크 연결을 확인하거나 전화로 문의해주세요.");
    } finally {
      sendLock.current = false;
      setSending(false);
    }
  }
  function update<K extends keyof Inquiry>(key: K, value: Inquiry[K]) {
    setData((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: undefined }));
  }
  function expand() {
    setExpanded(true);
    requestAnimationFrame(() =>
      document
        .getElementById(
          data.address.trim().length < 4 ? "estimate-address" : "size-0",
        )
        ?.focus(),
    );
  }
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (review) return;
    if (!expanded) {
      expand();
      return;
    }
    const found = { ...validateInquiry(data, 0), ...validateInquiry(data, 1) };
    setErrors(found);
    if (Object.keys(found).length) {
      const firstInvalidField = Object.keys(fieldIds).find(
        (field) => found[field as keyof InquiryErrors],
      );
      requestAnimationFrame(() => {
        if (firstInvalidField)
          document.getElementById(fieldIds[firstInvalidField])?.focus();
      });
      return;
    }
    setReview(true);
    requestAnimationFrame(() => heading.current?.focus());
  }
  function choices(name: "size" | "scope", label: string, options: string[]) {
    return (
      <fieldset
        className="estimate-fieldset"
        aria-describedby={errors[name] ? `${name}-error` : undefined}
      >
        <legend>
          {label} <span>*</span>
        </legend>
        <div
          className={`estimate-options ${name === "scope" ? "scope-options" : ""}`}
        >
          {options.map((option, index) => (
            <label key={option} className="estimate-option">
              <input
                id={`${name}-${index}`}
                type="radio"
                name={name}
                value={option}
                checked={data[name] === option}
                onChange={() => update(name, option)}
                aria-invalid={!!errors[name]}
                required
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        {errors[name] && (
          <p className="estimate-error" id={`${name}-error`}>
            {errors[name]}
          </p>
        )}
      </fieldset>
    );
  }
  return (
    <div
      className={`estimate-card ${expanded ? "is-expanded" : ""}`}
      id="estimate-form"
    >
      <h2 ref={heading} tabIndex={-1}>
        {sent ? "상담 문의가 전송되었습니다" : review ? "상담 내용을 확인해주세요" : "우리 집 무료 견적 상담"}
      </h2>
      <form onSubmit={submit} noValidate>
        {sent ? (
          <div className="estimate-review" role="status">
            <p>남겨주신 내용을 확인한 뒤 입력하신 연락처로 안내해드리겠습니다.</p>
          </div>
        ) : !review ? (
          <>
            <div className="estimate-field">
              <label
                className={expanded ? "" : "sr-only"}
                htmlFor="estimate-address"
              >
                시공할 집의 주소 <span>*</span>
              </label>
              <div className="estimate-address-row">
                <input
                  id="estimate-address"
                  name="address"
                  autoComplete="street-address"
                  value={data.address}
                  onChange={(e) => update("address", e.target.value)}
                  placeholder={
                    regionName
                      ? `${regionName} 주소 검색`
                      : "우리 집 주소를 검색해주세요"
                  }
                  maxLength={200}
                  required
                  aria-invalid={!!errors.address}
                  aria-describedby={
                    errors.address ? "address-error" : "address-help"
                  }
                />
                <AddressSearch
                  onSelect={(address) => {
                    update("address", address);
                    setExpanded(true);
                    requestAnimationFrame(() =>
                      document.getElementById("size-0")?.focus(),
                    );
                  }}
                />
              </div>
              {errors.address && (
                <p className="estimate-error" id="address-error">
                  {errors.address}
                </p>
              )}
              <p className="estimate-field-help" id="address-help">
                {expanded
                  ? "검색되지 않는 주소는 직접 입력해주세요."
                  : "도로명 또는 아파트명으로 검색할 수 있어요."}
              </p>
            </div>
            {expanded && (
              <div className="estimate-expanded-fields">
                {choices("size", "우리 집 평형을 선택해주세요", sizes)}
                {choices("scope", "교체 범위를 선택해주세요", scopes)}
                <div className="estimate-person-grid">
                  <div className="estimate-field">
                    <label htmlFor="estimate-name">
                      이름 <span>*</span>
                    </label>
                    <input
                      id="estimate-name"
                      name="name"
                      autoComplete="name"
                      value={data.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="성함"
                      maxLength={50}
                      required
                      aria-invalid={!!errors.name}
                      aria-describedby={errors.name ? "name-error" : undefined}
                    />
                    {errors.name && (
                      <p className="estimate-error" id="name-error">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="estimate-field">
                    <label htmlFor="estimate-phone">
                      연락처 <span>*</span>
                    </label>
                    <input
                      id="estimate-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel"
                      value={data.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="010-0000-0000"
                      maxLength={20}
                      required
                      aria-invalid={!!errors.phone}
                      aria-describedby={
                        errors.phone ? "phone-error" : undefined
                      }
                    />
                    {errors.phone && (
                      <p className="estimate-error" id="phone-error">
                        {errors.phone}
                      </p>
                    )}
                  </div>
                </div>
                <details className="estimate-message-toggle">
                  <summary>
                    추가로 남기실 말씀이 있나요? <span>선택</span>
                  </summary>
                  <label className="sr-only" htmlFor="estimate-message">
                    문의 내용
                  </label>
                  <textarea
                    id="estimate-message"
                    name="message"
                    rows={3}
                    value={data.message}
                    onChange={(e) => update("message", e.target.value)}
                    maxLength={2000}
                    placeholder="교체할 창의 위치, 희망 일정 등을 알려주세요."
                  />
                </details>
                <label className="estimate-confirm">
                  <input
                    id="estimate-confirmed"
                    type="checkbox"
                    checked={data.confirmed}
                    onChange={(e) => update("confirmed", e.target.checked)}
                    aria-invalid={!!errors.confirmed}
                    aria-describedby={
                      errors.confirmed ? "confirmed-error" : undefined
                    }
                  />
                  <span>입력한 연락처와 상담 내용을 확인했습니다.</span>
                </label>
                {errors.confirmed && (
                  <p className="estimate-error" id="confirmed-error">
                    {errors.confirmed}
                  </p>
                )}

              </div>
            )}
            <button type="submit" className="estimate-submit">
              {expanded
                ? "무료 견적 상담 내용 확인"
                : "무료 견적 상담 시작하기"}
              <Arrow />
            </button>
            {!expanded && (
              <div className="estimate-card-assurance">
                창의 크기부터 자재, 시공 범위까지.
                <br />
                우리 집에 필요한 조건을 함께 살펴드립니다.
              </div>
            )}
            {!expanded && (
              <button
                type="button"
                className="estimate-manual"
                onClick={expand}
              >
                주소가 검색되지 않나요? <span>직접 입력하기</span>
                <Arrow />
              </button>
            )}
          </>
        ) : (
          <div className="estimate-review">
            <p>아래 내용을 이메일로 전달할 준비가 되었습니다.</p>
            <dl>
              {[
                ["시공 주소", data.address],
                ["평형", data.size],
                ["시공 범위", data.scope],
                ["이름", data.name],
                ["연락처", data.phone],
                ["문의 내용", data.message || "상담 시 안내"],
              ].map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <p className="estimate-field-help">
              아래 버튼을 누르면 상담 내용이 담당자에게 이메일로 전송됩니다.
            </p>
            <button
              type="button"
              className="estimate-submit"
              onClick={sendInquiry}
              disabled={sending}
              aria-busy={sending}
            >
              {sending ? "상담 문의 전송 중…" : "이메일로 상담 문의하기"}
              <Arrow diagonal />
            </button>
            {sendError && <p className="estimate-error" role="alert">{sendError}</p>}
            <button
              className="estimate-edit"
              type="button"
              disabled={sending}
              onClick={() => {
                setReview(false);
                setSendError("");
                requestAnimationFrame(() => heading.current?.focus());
              }}
            >
              입력 내용 수정하기
            </button>
          </div>
        )}
        <p className="estimate-card-footnote">
          정확한 견적은 현장 실측 후 안내해드립니다.
        </p>
      </form>
    </div>
  );
}
