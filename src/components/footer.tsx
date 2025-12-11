export function Footer() {
  return (
    <footer className="border-t bg-slate-50 py-12 mt-20">
      <div className="container mx-auto px-4 text-center">
        <p className="text-slate-500 text-sm">
          © {new Date().getFullYear()} ResumeAgent. Built with AI.
        </p>
      </div>
    </footer>
  );
}
