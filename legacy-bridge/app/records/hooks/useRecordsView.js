"use client";

import { useEffect, useMemo, useState } from "react";
import { getCurrentUserRecords } from "../../../services/records/recordService";
import { ALL_ILLNESS_OPTION } from "../constants";
import {
  encodeRecordForShare,
  getShareableRecord,
} from "../utils/shareRecord.utils";

export default function useRecordsView() {
  const [query, setQuery] = useState("");
  const [dateRange, setDateRange] = useState("all");
  const [customDateRange, setCustomDateRange] = useState();
  const [illness, setIllness] = useState(ALL_ILLNESS_OPTION);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const [records, setRecords] = useState([]);
  const [selectedId, setSelectedId] = useState("");

  const illnessOptions = useMemo(
    () => [
      ALL_ILLNESS_OPTION,
      ...new Set(
        records
          .flatMap((record) =>
            getRecordFindings(record).map((finding) => finding.observation)
          )
          .filter(Boolean)
      ),
    ],
    [records]
  );

  const filteredRecords = useMemo(
    () =>
      records.filter((record) => {
        const findings = getRecordFindings(record);
        const findingsText = findings
          .map((finding) => `${finding.observation} ${finding.value} ${finding.unit}`)
          .join(" ");
        const matchesQuery = `${record.id} ${record.patientId} ${findingsText}`
          .toLowerCase()
          .includes(query.toLowerCase());
        const matchesIllness =
          illness === ALL_ILLNESS_OPTION ||
          findings.some((finding) => finding.observation === illness);
        const matchesDate = isWithinDateRange(record, dateRange, customDateRange);

        return matchesQuery && matchesIllness && matchesDate;
      }),
    [customDateRange, dateRange, illness, query, records]
  );

  const selectedRecord = records.find((record) => record.id === selectedId);

  useEffect(() => {
    const controller = new AbortController();

    getCurrentUserRecords({ signal: controller.signal })
      .then(setRecords)
      .catch((error) => {
        if (error.name !== "AbortError") {
          setRecords([]);
        }
      });

    return () => controller.abort();
  }, []);

  const clearFilters = () => {
    setQuery("");
    setDateRange("all");
    setCustomDateRange(undefined);
    setIllness(ALL_ILLNESS_OPTION);
  };

  const openFilter = () => setIsFilterOpen(true);
  const closeFilter = () => setIsFilterOpen(false);

  const openRecordDetail = (recordId) => {
    setSelectedId(recordId);
    setShareMessage("");
    setIsDetailOpen(true);
  };

  const closeRecordDetail = () => setIsDetailOpen(false);

  const getShareUrl = (record, shouldPrint = false) => {
    const token = encodeRecordForShare(getShareableRecord(record));
    const url = new URL("/records/share", window.location.origin);
    url.searchParams.set("record", token);

    if (shouldPrint) {
      url.searchParams.set("print", "1");
    }

    return url.toString();
  };

  const handleCopyShareLink = async (record) => {
    const shareUrl = getShareUrl(record);

    try {
      await window.navigator.clipboard.writeText(shareUrl);
      setShareMessage("Share link copied.");
    } catch {
      setShareMessage(shareUrl);
    }
  };

  const handleDownloadPdf = (record) => {
    window.open(getShareUrl(record, true), "_blank", "noopener,noreferrer");
  };

  return {
    clearFilters,
    closeFilter,
    closeRecordDetail,
    customDateRange,
    dateRange,
    filteredRecords,
    handleCopyShareLink,
    handleDownloadPdf,
    illness,
    illnessOptions,
    isDetailOpen,
    isFilterOpen,
    openFilter,
    openRecordDetail,
    records,
    selectedRecord,
    setCustomDateRange,
    setDateRange,
    setIllness,
    setQuery,
    shareMessage,
    query,
  };
}

export function getRecordFindings(record) {
  if (Array.isArray(record.findings) && record.findings.length > 0) {
    return record.findings;
  }

  return [
    {
      observation: record.observation || "",
      value: record.value || "",
      unit: "",
    },
  ];
}

function isWithinDateRange(record, dateRange, customDateRange) {
  if (dateRange === "all") {
    return true;
  }

  const rawDate = record.confirmedAtISO || record.confirmedAt;
  const recordDate = new Date(rawDate);

  if (Number.isNaN(recordDate.getTime())) {
    return dateRange === "all";
  }

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (dateRange === "today") {
    return recordDate >= startOfToday;
  }

  if (dateRange === "custom") {
    if (!customDateRange?.from) {
      return true;
    }

    const rangeStart = startOfDay(customDateRange.from);
    const rangeEnd = customDateRange.to
      ? endOfDay(customDateRange.to)
      : endOfDay(customDateRange.from);

    return recordDate >= rangeStart && recordDate <= rangeEnd;
  }

  const rangeDays = dateRange === "last7" ? 7 : 30;
  const rangeStart = new Date(now);
  rangeStart.setDate(now.getDate() - rangeDays);

  return recordDate >= rangeStart;
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    23,
    59,
    59,
    999
  );
}
