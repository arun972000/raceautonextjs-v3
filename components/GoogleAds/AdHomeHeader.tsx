const AdHomeBanner = () => {
    return (
      <div style={{ display: 'block', margin: '20px 0' }}>
        <ins
          className="adsbygoogle"
          style={{ display: 'block' }}
          data-ad-client="ca-pub-5751151754746971"
          data-ad-slot="2787988439"
          data-ad-format="auto"
          data-full-width-responsive="true"
        ></ins>
        <script
          dangerouslySetInnerHTML={{
            __html: '(adsbygoogle = window.adsbygoogle || []).push({});',
          }}
        />
      </div>
    );
  };
  
  export default AdHomeBanner;
  