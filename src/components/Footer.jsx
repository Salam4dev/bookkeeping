function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <p>
          &copy; {year} LedgerPro &mdash; Built with <span>❤</span> for smart finances
        </p>
      </div>
    </footer>
  );
}

export default Footer;
