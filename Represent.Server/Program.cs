using Represent.Server.Authentication;
using Represent.Server.Endpoints.Activities;
using Represent.Server.Endpoints.Auth;
using Represent.Server.Endpoints.User;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services
    .AddStravaAuthentication(builder.Configuration)
    .AddAuthorization();

builder.Services.AddHttpClient();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.AddAuthEndpoints();
app.AddUserEndpoints();
app.AddActivitiesEndpoints();

app.MapFallbackToFile("/index.html");

app.Run();
