package org.example.Controllers;


import lombok.AllArgsConstructor;
import org.example.Models.ShippingDetails;
import org.example.Services.ShippingDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/shipping-details")
@CrossOrigin(origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.DELETE})
public class ShippingDetailsController {

    private final ShippingDetailsService shippingDetailsService;

    @GetMapping("/{id}")
    public Optional<ShippingDetails> findShippingDetailsById(@PathVariable Integer id){
        return shippingDetailsService.findById(id);
    }

    @GetMapping
    public List<ShippingDetails> findAllShippingDetails(){
        return shippingDetailsService.findAll();
    }

    @PostMapping
    public ShippingDetails addShippingDetails(@RequestBody ShippingDetails shippingDetails) {
        return shippingDetailsService.add(shippingDetails);
    }

    @PutMapping("/{id}")
    public ShippingDetails updateShippingDetails(@PathVariable Integer id, @RequestBody ShippingDetails shippingDetails) {
        return shippingDetailsService.update(shippingDetails);
    }

    @DeleteMapping("/{id}")
    public boolean deleteShippingDetails(@PathVariable Integer id){
        return shippingDetailsService.delete(id);
    }

}
