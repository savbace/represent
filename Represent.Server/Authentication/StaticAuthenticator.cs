using RestSharp;
using RestSharp.Authenticators;

namespace Represent.Server.Authentication;

public class StaticAuthenticator(string token) : AuthenticatorBase(token)
{
    protected override ValueTask<Parameter> GetAuthenticationParameter(string accessToken)
    {
        return new ValueTask<Parameter>(new HeaderParameter("Authorization", "Bearer " + accessToken));
    }
}
