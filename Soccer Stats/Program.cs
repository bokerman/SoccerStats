using Microsoft.AspNetCore.ResponseCompression;
using Microsoft.Net.Http.Headers;
using System.IO.Compression;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllersWithViews();
builder.Services.AddMemoryCache();
builder.Services.AddHttpClient<IStatsDataService, StatsDataService>();
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

builder.Services.Configure<BrotliCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.Fastest;
});

builder.Services.Configure<GzipCompressionProviderOptions>(options =>
{
    options.Level = CompressionLevel.SmallestSize;
});

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
            const int durationInSeconds = 60 * 60 * 24 * 365; // 1 year
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
