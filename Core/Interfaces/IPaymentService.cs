using Core.Entities;

namespace Core.Interfaces;

public interface IPaymentService
{
    Task<ShoppingCart?> CreateOrUpdatePaymentIntent(string CartId);
    Task<string> RefundPayment(string paymentIntentId);
}
