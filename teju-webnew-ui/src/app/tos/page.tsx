"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function TermsOfService() {
    // const [agreed, setAgreed] = useState(false);
    // const router = useRouter();
    // const handleSubmit = async (e: React.FormEvent) =>  {
    //     e.preventDefault();
    //     router.push("/payment");
    // }
  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "0 auto", fontFamily: "sans-serif", color: "#eee" }}>
        {/* <form onSubmit={handleSubmit}> */}
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#fff" }}>Terms of Service</h1>

      <p>
        By accessing and using this website, you accept and agree to be bound by the terms and provision of this
        agreement. In addition, when using this website's services, you shall be subject to any posted guidelines or
        rules applicable to such services.
      </p>

      <h2 style={{ marginTop: "1.5rem", color: "#fff" }}>1. Use License</h2>
      <p>
        Permission is granted to temporarily download one copy of the materials on the website for personal,
        non-commercial transitory viewing only. This is the grant of a license, not a transfer of title.
      </p>

      <h2 style={{ marginTop: "1.5rem", color: "#fff" }}>2. Disclaimer</h2>
      <p>
        The materials on this site are provided “as is.” We make no warranties, expressed or implied, and hereby disclaim
        and negate all other warranties.
      </p>

      <h2 style={{ marginTop: "1.5rem", color: "#fff" }}>3. Limitations</h2>
      <p>
        In no event shall the website or its suppliers be liable for any damages arising out of the use or inability to
        use the materials on the site.
      </p>

      <h2 style={{ marginTop: "1.5rem", color: "#fff" }}>4. Revisions and Errata</h2>
      <p>
        The materials appearing on the website could include technical, typographical, or photographic errors. We do not
        warrant that any of the materials are accurate, complete, or current.
      </p>

      <h2 style={{ marginTop: "1.5rem", color: "#fff" }}>5. Modifications</h2>
      <p>
        We may revise these terms of service at any time without notice. By using this website, you agree to be bound by
        the then current version of these Terms of Service.
      </p>

      <h2 style={{ marginTop: "1.5rem", color: "#fff" }}>6. Governing Law</h2>
      <p>
        Any claim relating to this website shall be governed by the laws of the site owner's home jurisdiction without
        regard to its conflict of law provisions.
      </p>

      <p style={{ marginTop: "2rem", fontStyle: "italic", fontSize: "0.9rem", color: "#aaa" }}>
        Last updated: July 2025
      </p>
      
      {/* </form> */}
    </div>
  );
}
