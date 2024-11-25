using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Net.Http.Headers;
using System.IO.Compression;
using System.Text.Encodings.Web;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews().AddNewtonsoftJson(options =>
{
    // Configure global serializer settings here
    options.SerializerSettings.Formatting = Newtonsoft.Json.Formatting.Indented;
    options.SerializerSettings.StringEscapeHandling = Newtonsoft.Json.StringEscapeHandling.Default;
}); 

// Configure caching
builder.Services.AddMemoryCache();

// Configure serviceregistraiton
builder.Services.AddHttpClient<IStatsDataService, StatsDataService>();

// Configure compression 
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.Providers.Add<BrotliCompressionProvider>();
    options.Providers.Add<GzipCompressionProvider>();

    options.MimeTypes = ResponseCompressionDefaults.MimeTypes.Concat(
        new[] {
            "text/plain",
            "text/html",
            "text/css",
            "text/javascript",
            "application/javascript",
            "application/json",
            "application/xml",
            "text/xml"
        });
});
builder.Services.Configure<BrotliCompressionProviderOptions>(options => { options.Level = CompressionLevel.Fastest; });
builder.Services.Configure<GzipCompressionProviderOptions>(options => { options.Level = CompressionLevel.SmallestSize; });

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Root/Error");
    app.UseHsts();
}

app.UseResponseCompression();
app.UseHttpsRedirection();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        if (ctx.File.Name.EndsWith(".js") || ctx.File.Name.EndsWith(".css"))
        {
            const int durationInSeconds = 60 * 60 * 24 * 3; // 3 days
            ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                $"public,max-age={durationInSeconds},immutable";

           
        }
        else if (ctx.File.Name.EndsWith(".svg"))
        {
            const int durationInSeconds = 60 * 60 * 24 * 30; // 30 days
            ctx.Context.Response.Headers[HeaderNames.CacheControl] =
                $"public,max-age={durationInSeconds}";
        }

        ctx.Context.Response.Headers[HeaderNames.Vary] =
               HeaderNames.AcceptEncoding;
    }
});


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Root}/{action=Index}/{id?}");

app.Run();
