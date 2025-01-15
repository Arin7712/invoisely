import useSWR from "swr";
import { io } from "socket.io-client";

const socket = io(); // Connect to the Socket.IO server

const fetcher = (url) => fetch(url).then((res) => res.json());

export function useInvoices() {
  const { data, error, mutate } = useSWR("/api/invoices", fetcher, {
    revalidateOnFocus: false,
  });

  // Update invoices in real-time using Socket.IO
  socket.on("update-invoices", (update) => {
    mutate(); // Re-fetch the invoices when an update is received
  });

  return { invoices: data, loading: !data && !error, error };
}
